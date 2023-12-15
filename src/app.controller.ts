import { Response } from 'express';
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  welcome(@Res() response: Response) {
    return response.status(HttpStatus.OK).json({
      message: 'Welcome to Wallets API',
    });
  }
}
