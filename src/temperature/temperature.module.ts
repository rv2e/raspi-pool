import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLoggerModule } from 'logger/logger.module';

import { TemperatureEntity } from './temperature.entity';
import { TemperatureService } from './temperature.service';

@Module({
  controllers: [],
  exports: [TemperatureService],
  imports: [TypeOrmModule.forFeature([TemperatureEntity]), CustomLoggerModule],
  providers: [TemperatureService],
})
export class TemperatureModule {}
