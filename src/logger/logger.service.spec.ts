import { captureException } from '@sentry/node';
import { Logger } from 'winston';

import { CustomLoggerService } from './logger.service';

jest.mock('@sentry/node');

describe('CustomLoggerService', () => {
  let customLogger: CustomLoggerService;
  let mockedLogger: Logger;

  beforeEach(() => {
    mockedLogger = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      verbose: jest.fn(),
      warn: jest.fn(),
    } as any;
    customLogger = new CustomLoggerService(mockedLogger);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('sends the error message to Sentry when logging the error', () => {
    expect(captureException).not.toHaveBeenCalled();
    customLogger.error(new Error('fake_message'));
    expect(captureException).toHaveBeenCalledTimes(1);
    expect(captureException).toHaveBeenCalledWith(new Error('fake_message'));
  });

  it('sends the error message to Sentry when logging the error message', () => {
    expect(captureException).not.toHaveBeenCalled();
    customLogger.error('fake_message');
    expect(captureException).toHaveBeenCalledTimes(1);
    expect(captureException).toHaveBeenCalledWith(new Error('fake_message'));
    expect((captureException as jest.Mock).mock.calls[0][0].stack).not.toEqual(
      new Error('fake_message').stack,
    );
  });

  it('sends the warning message to Sentry when logging the warning', () => {
    expect(captureException).not.toHaveBeenCalled();
    customLogger.warn('fake_message');
    expect(captureException).toHaveBeenCalledTimes(1);
    expect(captureException).toHaveBeenCalledWith('fake_message');
  });

  it('calls the "warn" method correctly', () => {
    expect(mockedLogger.warn).not.toHaveBeenCalled();
    customLogger.warn('test');
    expect(mockedLogger.warn).toHaveBeenCalledWith('test', {
      context: undefined,
    });
  });

  it('calls the "debug" method correctly', () => {
    expect(mockedLogger.debug).not.toHaveBeenCalled();
    customLogger.debug('test');
    expect(mockedLogger.debug).toHaveBeenCalledWith('test', {
      context: undefined,
    });
  });

  it('calls the "verbose" method correctly', () => {
    expect(mockedLogger.verbose).not.toHaveBeenCalled();
    customLogger.verbose('test');
    expect(mockedLogger.verbose).toHaveBeenCalledWith('test', {
      context: undefined,
    });
  });

  it('calls the "error" method correctly', () => {
    expect(mockedLogger.error).not.toHaveBeenCalled();
    customLogger.error('test');
    expect(mockedLogger.error).toHaveBeenCalledWith(new Error('test'), {
      context: undefined,
      trace: undefined,
    });
  });

  it('calls the "log" method correctly', () => {
    expect(mockedLogger.info).not.toHaveBeenCalled();
    customLogger.log('test');
    expect(mockedLogger.info).toHaveBeenCalledWith('test', {
      context: undefined,
    });
  });
});
