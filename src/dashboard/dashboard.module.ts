import { Module } from '@nestjs/common';
import { CustomLoggerModule } from 'logger/logger.module';

import { DashboardController } from 'dashboard/dashboard.controller';
import { TemperatureModule } from 'temperature/temperature.module';
import { LightModule } from 'light/light.module';
import { VerticalActuatorModule } from 'vertical-actuator/vertical-actuator.module';

@Module({
  controllers: [DashboardController],
  exports: [],
  imports: [
    CustomLoggerModule,
    TemperatureModule,
    LightModule,
    VerticalActuatorModule,
  ],
  providers: [],
})
export class DashboardModule {}
