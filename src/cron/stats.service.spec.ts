import { Cron, CronExpression } from '@nestjs/schedule';
import { StatsService } from './stats.service';
import { OutsideTemperatureService } from 'temperature/outside-temperature.service';
import { CustomLoggerService } from 'logger/logger.service';
import { WaterTemperatureService } from 'temperature/water-temperature.service';

jest.mock('@nestjs/schedule', () => ({
  Cron: jest.fn(() => jest.fn()),
  CronExpression: {
    EVERY_10_MINUTES: 'every ten minutes',
  },
}));

describe('Stats Service', () => {
  let outsideTemperatureService: jest.Mocked<OutsideTemperatureService>;
  let waterTemperatureService: jest.Mocked<WaterTemperatureService>;
  let loggerService: jest.Mocked<CustomLoggerService>;
  let statsService: StatsService;

  beforeEach(() => {
    loggerService = {
      error: jest.fn(),
    } as any;

    outsideTemperatureService = {
      takeTemperature: jest.fn().mockResolvedValue({ temperature: 2 }),
    } as any;

    waterTemperatureService = {
      takeTemperature: jest.fn().mockResolvedValue({ temperature: 5 }),
    } as any;

    statsService = new StatsService(
      loggerService,
      outsideTemperatureService,
      waterTemperatureService,
    );
  });

  describe('takeOutsideTemperateStats', () => {
    it('takes the temperature', async () => {
      expect(outsideTemperatureService.takeTemperature).not.toHaveBeenCalled();
      await expect(
        statsService.takeOutsideTemperateStats(),
      ).resolves.toBeUndefined();
      expect(outsideTemperatureService.takeTemperature).toHaveBeenCalledTimes(
        1,
      );
      expect(outsideTemperatureService.takeTemperature).toHaveBeenCalledWith();
    });

    it('forwards the error', async () => {
      outsideTemperatureService.takeTemperature.mockRejectedValue(
        new Error('fake'),
      );
      expect(loggerService.error).not.toHaveBeenCalled();
      await expect(
        statsService.takeOutsideTemperateStats(),
      ).resolves.toBeUndefined();
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
        'takeOutsideTemperateStats',
        expect.anything(),
      );
    });
  });

  describe('takeWaterTemperateStats', () => {
    it('takes the temperature', async () => {
      expect(waterTemperatureService.takeTemperature).not.toHaveBeenCalled();
      await expect(
        statsService.takeWaterTemperateStats(),
      ).resolves.toBeUndefined();
      expect(waterTemperatureService.takeTemperature).toHaveBeenCalledTimes(1);
      expect(waterTemperatureService.takeTemperature).toHaveBeenCalledWith();
    });

    it('forwards the error', async () => {
      waterTemperatureService.takeTemperature.mockRejectedValue(
        new Error('fake'),
      );
      expect(loggerService.error).not.toHaveBeenCalled();
      await expect(
        statsService.takeWaterTemperateStats(),
      ).resolves.toBeUndefined();
      expect(loggerService.error).toHaveBeenCalledTimes(1);
      expect(loggerService.error).toHaveBeenCalledWith(new Error('fake'));
    });

    it('sets a cron job for every 10 minutes', async () => {
      expect(Cron).toHaveBeenCalled();
      expect((Cron as jest.Mock).mock.calls[1]).toEqual([
        CronExpression.EVERY_10_MINUTES,
      ]);
      expect((Cron as jest.Mock).mock.results[1].value).toHaveBeenCalledTimes(
        1,
      );
      expect((Cron as jest.Mock).mock.results[1].value).toHaveBeenCalledWith(
        {},
        'takeWaterTemperateStats',
        expect.anything(),
      );
    });
  });
});
