import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CustomLoggerService } from 'logger/logger.service';
import { TemperatureService } from 'temperature/temperature.service';

@Injectable()
export class StatsService {
  constructor(
    private readonly customLoggerService: CustomLoggerService,
    private readonly temperatureService: TemperatureService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  public async takeTemperateStats() {
    try {
      await this.temperatureService.takeTemperature();
    } catch (error) {
      this.customLoggerService.error(error);
    }
  }
}
