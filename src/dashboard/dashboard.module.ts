import { Module } from '@nestjs/common';
import { CustomLoggerModule } from 'logger/logger.module';

import { DashboardController } from 'dashboard/dashboard.controller';
import { TemperatureModule } from 'temperature/temperature.module';
import { LightModule } from 'light/light.module';
import { VerticalActuatorModule } from 'vertical-actuator/vertical-actuator.module';
import { MotorModule } from 'motors/motor.module';
import { CronModule } from 'cron/cron.module';

@Module({
  controllers: [DashboardController],
  exports: [],
  imports: [
    CustomLoggerModule,
    TemperatureModule,
    LightModule,
    MotorModule,
    VerticalActuatorModule,
    CronModule,
  ],
  providers: [],
})
export class DashboardModule {}
