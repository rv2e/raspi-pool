import { Module } from '@nestjs/common';
import { CustomLoggerModule } from 'logger/logger.module';

import { DashboardController } from 'dashboard/dashboard.controller';
import { TemperatureModule } from 'temperature/temperature.module';

@Module({
  controllers: [DashboardController],
  exports: [],
  imports: [CustomLoggerModule, TemperatureModule],
  providers: [],
})
export class DashboardModule {}
