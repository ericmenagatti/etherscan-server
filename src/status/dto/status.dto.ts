import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStatusDTO {
  @IsNotEmpty()
  @IsString()
  eth_usd: string;
  @IsNotEmpty()
  @IsString()
  eth_eur: string;
  @IsNotEmpty()
  @IsString()
  eur_usd: string;
  @IsNotEmpty()
  @IsString()
  last_updated: string;
}

export class UpdateStatusDTO extends PartialType(CreateStatusDTO) {}
