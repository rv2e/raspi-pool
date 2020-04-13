import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CustomLoggerModule } from 'logger/logger.module';
import { TemperatureModule } from 'temperature/temperature.module';

@Module({
  imports: [CustomLoggerModule, TemperatureModule],
  providers: [StatsService],
})
export class CronModule {}
