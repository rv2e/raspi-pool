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
    const temperatureEntities = await this.temperatureService.getLastWeekMetrics();

    return {
      lastTemperature: temperatureEntities.slice(-1)[0],
      temperatureData: temperatureEntities.map(
        ({ createdAt, temperature }) => ({
          x: createdAt,
          y: temperature,
        }),
      ),
    };
  }
}
