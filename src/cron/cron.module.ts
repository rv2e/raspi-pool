import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CustomLoggerModule } from 'logger/logger.module';
import { TemperatureModule } from 'temperature/temperature.module';
import { MotorModule } from 'motors/motor.module';
import { SmartSystemService } from './smart-system.service';

@Module({
  exports: [SmartSystemService],
  imports: [CustomLoggerModule, TemperatureModule, MotorModule],
  providers: [StatsService, SmartSystemService],
})
export class CronModule {}
