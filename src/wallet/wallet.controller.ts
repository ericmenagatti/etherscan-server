import { Response } from 'express';
import {
  Controller,
  Res,
  Get,
  Post,
  Patch,
  Body,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { WalletService } from 'src/wallet/wallet.service';
import { CreateWalletDTO, UpdateWalletDTO } from 'src/wallet/dto/wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getAllWallets(@Res() response: Response) {
    const wallets = await this.walletService.retrieveWallets();
    return response.status(HttpStatus.OK).json(wallets);
  }
  @Post()
  async createWallet(
    @Res() response: Response,
    @Body() createWalletDTO: CreateWalletDTO,
  ) {
    try {
      const { address } = createWalletDTO;
      const exists = await this.walletService.retrieveWallet(address!);
      if (exists) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'Wallet already exists',
        });
      }
      const newWallet = await this.walletService.createWallet(address!);
      return response.status(HttpStatus.OK).json({
        message: 'Wallet created successfully',
        newWallet,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server error',
        error,
      });
    }
  }
  @Put()
  async refreshWallets(@Res() response: Response) {
    try {
      const wallets = await this.walletService.refreshWallets();
      return response.status(HttpStatus.OK).json({
        message: 'Wallets refreshed successfully',
        wallets,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server error',
        error,
      });
    }
  }

  @Patch('/:address')
  async updateWallet(
    @Res() response: Response,
    @Param('address') address: string,
    @Body() updateWalletDTO: UpdateWalletDTO,
  ) {
    try {
      const { display_name, favorite } = updateWalletDTO;
      const updatedWallet = await this.walletService.updateWallet(address, {
        display_name,
        favorite,
      });
      return response.status(HttpStatus.OK).json({
        message: 'Wallet updated successfully',
        updatedWallet,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }
}
