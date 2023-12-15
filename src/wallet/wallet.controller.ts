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
} from '@nestjs/common';
import { WalletService } from 'src/wallet/wallet.service';
import { CreateWalletDTO, UpdateWalletDTO } from 'src/wallet/dto/wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async createWallet(
    @Res() response: Response,
    @Body() createUserDTO: CreateWalletDTO,
  ) {
    try {
      const { address } = createUserDTO;
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

  @Get()
  async getAllWallets(@Res() response: Response) {
    const wallets = await this.walletService.retrieveWallets();

    return response.status(HttpStatus.OK).json(wallets);
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
