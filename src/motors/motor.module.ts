import { Module } from '@nestjs/common';
import { CustomLoggerModule } from 'logger/logger.module';
import { ConfigModule } from 'config/config.module';
import { MotorService } from './motor.service';

@Module({
  exports: [MotorService],
  imports: [CustomLoggerModule, ConfigModule],
  providers: [MotorService],
})
export class MotorModule {}
