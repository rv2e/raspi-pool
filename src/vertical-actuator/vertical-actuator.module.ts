import { Module } from '@nestjs/common';
import { CustomLoggerModule } from 'logger/logger.module';
import { VerticalActuatorService } from './vertical-actuator.service';
import { ConfigModule } from 'config/config.module';

@Module({
  exports: [VerticalActuatorService],
  imports: [CustomLoggerModule, ConfigModule],
  providers: [VerticalActuatorService],
})
export class VerticalActuatorModule {}
