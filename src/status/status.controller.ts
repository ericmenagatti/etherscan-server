import { Response } from 'express';
import { Controller, Res, Get, Post, HttpStatus } from '@nestjs/common';
import { StatusService } from 'src/status/status.service';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  async retrieveStatus(@Res() response: Response) {
    const status = await this.statusService.retrieveStatus();

    return response.status(HttpStatus.OK).json(status);
  }
  @Post()
  async initializeStatus(@Res() response: Response) {
    try {
      const newStatus = await this.statusService.createStatus();
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
