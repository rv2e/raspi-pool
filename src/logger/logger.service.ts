import { LoggerService } from '@nestjs/common';
import { captureException } from '@sentry/node';
import * as _ from 'lodash';
import { Logger } from 'winston';

export class CustomLoggerService implements LoggerService {
  constructor(private readonly logger: Logger) {}

  public log(message: string, context?: string): Logger {
    return this.logger.info(message, { context });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(errorOrMessage: any, trace?: string, context?: string): Logger {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any = errorOrMessage;
    if (!_.isError(errorOrMessage)) {
      error = new Error(String(errorOrMessage));
    }

    captureException(error);
    return this.logger.error(error, { context, trace });
  }

  public warn(message: string, context?: string): Logger {
    captureException(message);
    return this.logger.warn(message, { context });
  }

  public debug(message: string, context?: string): Logger {
    return this.logger.debug(message, { context });
  }

  public verbose(message: string, context?: string): Logger {
    return this.logger.verbose(message, { context });
  }
}
