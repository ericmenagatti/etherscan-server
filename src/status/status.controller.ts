import { Response } from 'express';
import { Controller, Res, Get, Post, Body, HttpStatus } from '@nestjs/common';
import { StatusService } from 'src/status/status.service';
import { CreateStatusDTO } from 'src/status/dto/status.dto';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  async retrieveStatus(@Res() response: Response) {
    const status = await this.statusService.retrieveStatus();

    return response.status(HttpStatus.OK).json(status);
  }
  @Post()
  async initializeStatus(
    @Res() response: Response,
    @Body() createUserDTO: CreateStatusDTO,
  ) {
    try {
      const { eth_usd, eth_eur, eur_usd, last_updated } = createUserDTO;
      const newStatus = await this.statusService.initializeStatus(
        eth_usd,
        eth_eur,
        eur_usd,
        last_updated,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Status initialized successfully',
        newStatus,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Server error',
        error,
      });
    }
  }
}
