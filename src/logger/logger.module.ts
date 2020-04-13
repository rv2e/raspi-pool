import { Module } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

import { CustomLoggerService } from './logger.service';

const { combine, errors, timestamp, json } = format;

@Module({
  exports: [CustomLoggerService],
  providers: [
    {
      provide: CustomLoggerService,
      useValue: new CustomLoggerService(
        createLogger({
          exceptionHandlers: [new transports.Console()],
          format: combine(errors({ stack: true }), timestamp(), json()),
          transports: [new transports.Console()],
        }),
      ),
    },
  ],
})
export class CustomLoggerModule {}
