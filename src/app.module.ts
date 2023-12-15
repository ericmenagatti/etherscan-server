import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatusController } from './status/status.controller';
import { StatusService } from './status/status.service';
import { StatusSchema } from 'src/status/status.schema';
import { HttpModule } from '@nestjs/axios';
import { WalletController } from './wallet/wallet.controller';
import { WalletService } from './wallet/wallet.service';
import { WalletSchema } from 'src/wallet/wallet.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    MongooseModule.forFeature([{ name: 'Status', schema: StatusSchema }]),
    MongooseModule.forFeature([{ name: 'Wallet', schema: WalletSchema }]),
  ],
  controllers: [AppController, StatusController, WalletController],
  providers: [AppService, StatusService, WalletService],
})
export class AppModule {}
