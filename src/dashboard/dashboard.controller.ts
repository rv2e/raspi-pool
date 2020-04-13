import { Controller, Get, Render } from '@nestjs/common';
import { CustomLoggerService } from 'logger/logger.service';

import { TemperatureService } from 'temperature/temperature.service';

@Controller('/status')
export class DashboardController {
  constructor(
    private readonly temperatureService: TemperatureService,
    private readonly customLoggerService: CustomLoggerService,
  ) {}

  @Get('/')
  @Render('dashboard')
  public async renderDashboard() {
    const temperatureData = this.temperatureService.getLastData();
    return { temperatureData };
  }
}
