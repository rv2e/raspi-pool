import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { captureException } from '@sentry/node';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost): void {
    super.catch(exception, host);
    captureException(exception);
  }
}
