import { Controller, Get, Render } from '@nestjs/common';
import { CustomLoggerService } from 'logger/logger.service';
import _ from 'lodash';
import { OutsideTemperatureService } from 'temperature/outside-temperature.service';
import { WaterTemperatureService } from 'temperature/water-temperature.service';
import { BoxTemperatureService } from 'temperature/box-temperature.service';

@Controller('/status')
export class DashboardController {
  constructor(
    private readonly customLoggerService: CustomLoggerService,
    private readonly outsideTemperatureService: OutsideTemperatureService,
    private readonly waterTemperatureService: WaterTemperatureService,
    private readonly boxTemperatureService: BoxTemperatureService,
  ) {}

  @Get('/')
  @Render('dashboard')
  public async renderDashboard() {
    const outsideTemperatureEntities = await this.outsideTemperatureService.getLastWeekMetrics();
    const waterTemperatureEntities = await this.waterTemperatureService.getLastWeekMetrics();
    const boxTemperatureEntities = await this.boxTemperatureService.getLastWeekMetrics();

    return {
      lastBoxTemperature: boxTemperatureEntities.slice(-1)[0],
      lastWaterTemperature: waterTemperatureEntities.slice(-1)[0],
      lastOutsideTemperature: outsideTemperatureEntities.slice(-1)[0],
      plotly: [
        {
          type: 'scatter',
          mode: 'lines',
          name: 'Outside Temperature',
          line: { color: 'red' },
          x: outsideTemperatureEntities.map(({ createdAt }) => createdAt),
          y: outsideTemperatureEntities.map(({ temperature }) => temperature),
        },
        {
          type: 'scatter',
          mode: 'lines',
          name: 'Box Temperature',
          line: { color: 'orange' },
          x: boxTemperatureEntities.map(({ createdAt }) => createdAt),
          y: boxTemperatureEntities.map(({ temperature }) => temperature),
        },
        {
          type: 'scatter',
          mode: 'lines',
          name: 'Water Temperature',
          line: { color: 'black' },
          x: waterTemperatureEntities.map(({ createdAt }) => createdAt),
          y: waterTemperatureEntities.map(({ temperature }) => temperature),
        },
      ],
    };
  }
}
