import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLoggerModule } from 'logger/logger.module';

import { OutsideTemperatureEntity } from './outside-temperature.entity';
import { OutsideTemperatureService } from './outside-temperature.service';
import { ConfigModule } from 'config/config.module';
import { WaterTemperatureService } from './water-temperature.service';
import { WaterTemperatureEntity } from './water-temperature.entity';

@Module({
  controllers: [],
  exports: [OutsideTemperatureService, WaterTemperatureService],
  imports: [
    TypeOrmModule.forFeature([
      OutsideTemperatureEntity,
      WaterTemperatureEntity,
    ]),
    CustomLoggerModule,
    ConfigModule,
  ],
  providers: [OutsideTemperatureService, WaterTemperatureService],
})
export class TemperatureModule {}
