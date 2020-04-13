import { captureException } from '@sentry/node';

import { AllExceptionsFilter } from './exceptionsFilters';

jest.mock('@nestjs/core');
jest.mock('@sentry/node');

describe('exceptionsFilters', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('AllExceptionsFilter', () => {
    it('logs the exception caught by the filter', () => {
      const error = new Error('FAKE');
      const exceptionFilter = new AllExceptionsFilter();
      expect(captureException).not.toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(exceptionFilter.catch(error, {} as any)).toBeUndefined();
      expect(captureException).toHaveBeenCalledTimes(1);
      expect(captureException).toHaveBeenCalledWith(error);
    });
  });
});
