import { catchError, firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Status } from 'src/status/status.schema';
import { AxiosError } from 'axios';

@Injectable()
export class StatusService {
  constructor(
    @InjectModel('Status') private readonly statusModel: Model<Status>,
    private readonly httpService: HttpService,
  ) {}

  async initializeStatus(
    eth_usd: string,
    eth_eur: string,
    eur_usd: string,
    last_updated: string,
  ): Promise<Status> {
    const newStatus = await this.statusModel.create({
      eth_usd,
      eth_eur,
      eur_usd,
      last_updated,
    });
    return newStatus;
  }

  async updateStatus(
    eth_usd: string,
    eth_eur: string,
    eur_usd: string,
    last_updated: string,
  ): Promise<any> {
    const newStatus = await this.statusModel.findOneAndUpdate(
      {},
      {
        eth_usd,
        eth_eur,
        eur_usd,
        last_updated,
      },
      {
        new: true,
      },
    );
    return newStatus;
  }

  async createStatus(): Promise<Status> {
    const currentStatus = await this.statusModel.findOne({}).lean().exec();
    const now = Math.floor(new Date().getTime() / 1000);

    if (!currentStatus || now - +currentStatus.last_updated >= 3600) {
      const { data: ethPricesData } = await firstValueFrom(
        this.httpService
          .get(
            'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR',
          )
          .pipe(
            catchError((error: AxiosError) => {
              console.log(error?.response?.data);
              throw 'An error happened!';
            }),
          ),
      );

      const { data: currentUsdPriceData } = await firstValueFrom(
        this.httpService
          .get(
            'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=NSZCD6S4TKVWRS13PMQFMVTNP6H7NAGHUY',
          )
          .pipe(
            catchError((error: AxiosError) => {
              console.log(error?.response?.data);
              throw 'An error happened!';
            }),
          ),
      );

      const eth_usd = +currentUsdPriceData.result.ethusd;
      const eur_usd = ethPricesData.USD / ethPricesData.EUR;
      const eth_eur = eth_usd / eur_usd;
      const last_updated = Math.floor(new Date().getTime() / 1000);

      if (!currentStatus) {
        const newStatus = await this.initializeStatus(
          String(eth_usd),
          String(eth_eur),
          String(eur_usd),
          String(last_updated),
        );
        return newStatus;
      }
      if (now - +currentStatus.last_updated >= 15) {
        const newStatus = await this.updateStatus(
          String(eth_usd),
          String(eth_eur),
          String(eur_usd),
          String(last_updated),
        );
        return newStatus;
      }
    }
    return currentStatus;
  }

  async retrieveStatus(): Promise<Status> {
    const currentStatus = await this.statusModel.findOne({}).lean().exec();
    return currentStatus!;
  }
}
