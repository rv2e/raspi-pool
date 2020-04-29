import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CustomLoggerService } from 'logger/logger.service';
import { OutsideTemperatureService } from 'temperature/outside-temperature.service';
import { WaterTemperatureService } from 'temperature/water-temperature.service';

@Injectable()
export class StatsService {
  constructor(
    private readonly customLoggerService: CustomLoggerService,
    private readonly outsideTemperatureService: OutsideTemperatureService,
    private readonly waterTemperatureService: WaterTemperatureService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  public async takeOutsideTemperateStats() {
    try {
      await this.outsideTemperatureService.takeTemperature();
    } catch (error) {
      this.customLoggerService.error(error);
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  public async takeWaterTemperateStats() {
    try {
      await this.waterTemperatureService.takeTemperature();
    } catch (error) {
      this.customLoggerService.error(error);
    }
  }
}
