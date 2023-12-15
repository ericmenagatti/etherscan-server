import { catchError, firstValueFrom } from 'rxjs';
import * as ethers from 'ethers';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosError } from 'axios';
import { Wallet } from 'src/wallet/wallet.schema';
import { UpdateWalletDTO } from 'src/wallet/dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('Wallet') private readonly walletModal: Model<Wallet>,
    private readonly httpService: HttpService,
  ) {}

  async getEther(address: string): Promise<string> {
    const { data: weiBalanceData } = await firstValueFrom(
      this.httpService
        .get(
          `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_KEY}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error?.response?.data);
            throw 'An error happened!';
          }),
        ),
    );
    return ethers.formatEther(weiBalanceData.result);
  }

  async getCreationDate(address: string): Promise<string> {
    const { data: creationDate } = await firstValueFrom(
      this.httpService
        .get(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=${process.env.ETHERSCAN_KEY}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error?.response?.data);
            throw 'An error happened!';
          }),
        ),
    );
    return creationDate.result[0].timeStamp;
  }

  async createWallet(address: string): Promise<Wallet> {
    const balance = await this.getEther(address);
    const now = Math.floor(new Date().getTime() / 1000);
    const creation_date = await this.getCreationDate(address);
    const last_updated = now;

    const newWallet = await this.walletModal.create({
      address,
      display_name: '',
      favorite: false,
      balance,
      creation_date,
      last_updated,
    });

    return newWallet;
  }

  async refreshWallet(address: string): Promise<Wallet> {
    const balance = await this.getEther(address);
    const now = Math.floor(new Date().getTime() / 1000);

    const updatedWallet = await this.walletModal.findOneAndUpdate(
      { address },
      {
        balance,
        last_updated: now,
      },
      { new: true },
    );
    return updatedWallet!;
  }

  async retrieveWallets(): Promise<Wallet[]> {
    const now = Math.floor(new Date().getTime() / 1000);
    const wallets = await this.walletModal.find({});

    const updatedWallets: Wallet[] = await Promise.all(
      wallets.map((wallet) => {
        if (now - +wallet.last_updated >= 3600) {
          this.refreshWallet(wallet.address);
        }
        return wallet;
      }),
    );
    return updatedWallets;
  }

  async retrieveWallet(address: string): Promise<Wallet> {
    const wallet = await this.walletModal.findOne({ address });
    return wallet!;
  }

  async updateWallet(
    address: string,
    wallet: UpdateWalletDTO,
  ): Promise<Wallet> {
    const updatedWallet = await this.walletModal.findOneAndUpdate(
      { address },
      wallet,
      { new: true },
    );
    return updatedWallet!;
  }
}
