import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsEthereumAddress,
  IsOptional,
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

export class UpdateWalletDTO {
  @IsOptional()
  @IsString()
  display_name: string;
  @IsOptional()
  @IsBoolean()
  favorite: boolean;
}

export class CreateWalletDTO extends PartialType(WalletDTO) {}
