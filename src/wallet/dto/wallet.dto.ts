import { PartialType, OmitType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsEthereumAddress,
} from 'class-validator';

export class WalletDTO {
  @IsNotEmpty()
  @IsString()
  @IsEthereumAddress()
  address: string;
  @IsNotEmpty()
  @IsString()
  display_name: string;
  @IsNotEmpty()
  @IsBoolean()
  favorite: boolean;
  @IsNotEmpty()
  @IsString()
  balance: string;
  @IsNotEmpty()
  @IsString()
  creation_date: string;
  @IsNotEmpty()
  @IsString()
  last_updated: string;
}

export class CreateWalletDTO extends PartialType(WalletDTO) {}
export class UpdateWalletDTO extends PartialType(
  OmitType(WalletDTO, ['address'] as const),
) {}
