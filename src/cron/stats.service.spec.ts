import { Cron, CronExpression } from '@nestjs/schedule';
import { StatsService } from './stats.service';
import { TemperatureService } from 'temperature/temperature.service';
import { CustomLoggerService } from 'logger/logger.service';

jest.mock('@nestjs/schedule', () => ({
  Cron: jest.fn(() => jest.fn()),
  CronExpression: {
    EVERY_10_MINUTES: 'every ten minutes',
  },
}));

describe('Stats Service', () => {
  let temperatureService: jest.Mocked<TemperatureService>;
  let loggerService: jest.Mocked<CustomLoggerService>;
  let statsService: StatsService;

  beforeEach(() => {
    loggerService = {
      error: jest.fn(),
    } as any;

    temperatureService = {
      takeTemperature: jest.fn().mockResolvedValue({ temperature: 2 }),
    } as any;

    statsService = new StatsService(loggerService, temperatureService);
  });

  describe('takeTemperateStats', () => {
    it('takes the temperature', async () => {
      expect(temperatureService.takeTemperature).not.toHaveBeenCalled();
      await expect(statsService.takeTemperateStats()).resolves.toBeUndefined();
      expect(temperatureService.takeTemperature).toHaveBeenCalledTimes(1);
      expect(temperatureService.takeTemperature).toHaveBeenCalledWith();
    });

    it('forwards the error', async () => {
      temperatureService.takeTemperature.mockRejectedValue(new Error('fake'));
      expect(loggerService.error).not.toHaveBeenCalled();
      await expect(statsService.takeTemperateStats()).resolves.toBeUndefined();
      expect(loggerService.error).toHaveBeenCalledTimes(1);
      expect(loggerService.error).toHaveBeenCalledWith(new Error('fake'));
    });

    it('sets a cron job for every 10 minutes', async () => {
      expect(Cron).toHaveBeenCalled();
      expect((Cron as jest.Mock).mock.calls[0]).toEqual([
        CronExpression.EVERY_10_MINUTES,
      ]);
      expect((Cron as jest.Mock).mock.results[0].value).toHaveBeenCalledTimes(
        1,
      );
      expect((Cron as jest.Mock).mock.results[0].value).toHaveBeenCalledWith(
        {},
        'takeTemperateStats',
        expect.anything(),
      );
    });
  });
});
