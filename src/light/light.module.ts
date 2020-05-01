import { Module } from '@nestjs/common';
import { CustomLoggerModule } from 'logger/logger.module';
import { ConfigModule } from 'config/config.module';
import { LightService } from './light.service';

@Module({
  exports: [LightService],
  imports: [CustomLoggerModule, ConfigModule],
  providers: [LightService],
})
export class LightModule {}
