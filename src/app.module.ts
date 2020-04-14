import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from 'database/config';
import { CustomLoggerModule } from 'logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';

import { ConfigModule } from './config/config.module';
import { MetaController } from './meta/meta.controller';
import { DashboardModule } from 'dashboard/dashboard.module';
import { TemperatureModule } from 'temperature/temperature.module';
import { CronModule } from 'cron/cron.module';

@Module({
  controllers: [MetaController],
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig),
    CronModule,
    DashboardModule,
    TemperatureModule,
    ConfigModule,
    CustomLoggerModule,
  ],
  providers: [],
})
export class AppModule {}
