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
      lastTemperature: temperatureEntities[0],
      temperatureData: {
        labels: temperatureEntities.map(
          ({ createdAt }) =>
            `${createdAt.toISOString().slice(8, 19).split('T').join('th at ')}`,
        ),
        datasets: temperatureEntities.map(({ temperature }) =>
          temperature.toFixed(1),
        ),
      },
    };
  }
}
