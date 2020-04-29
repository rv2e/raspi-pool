import { Controller, Get, Render } from '@nestjs/common';
import { CustomLoggerService } from 'logger/logger.service';

import { OutsideTemperatureService } from 'temperature/outside-temperature.service';
// import { WaterTemperatureService } from 'temperature/water-temperature.service';

@Controller('/status')
export class DashboardController {
  constructor(
    private readonly outsideTemperatureService: OutsideTemperatureService,
    // private readonly waterTemperatureService: WaterTemperatureService,
    private readonly customLoggerService: CustomLoggerService,
  ) {}

  @Get('/')
  @Render('dashboard')
  public async renderDashboard() {
    const outsideTemperatureEntities = await this.outsideTemperatureService.getLastWeekMetrics();
    // const waterTemperatureEntities = await this.waterTemperatureService.getLastWeekMetrics();

    return {
      lastTemperature: outsideTemperatureEntities.slice(-1)[0],
      temperatureData: outsideTemperatureEntities.map(
        ({ createdAt, temperature }) => ({
          x: createdAt,
          y: temperature,
        }),
      ),
    };
  }
}
