import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { OutsideTemperatureService } from 'temperature/outside-temperature.service';
import { CustomLoggerService } from 'logger/logger.service';
import { WaterTemperatureService } from 'temperature/water-temperature.service';
import { BoxTemperatureService } from 'temperature/box-temperature.service';
import { SmartSystemService } from './smart-system.service';
import { MotorService } from 'motors/motor.service';

jest.mock('@nestjs/schedule', () => ({
  Cron: jest.fn(() => jest.fn()),
  CronExpression: {
    EVERY_10_MINUTES: 'every ten minutes',
    EVERY_DAY_AT_4PM: 'every day at 4pm',
    EVERY_HOUR: 'every hour',
  },
}));

describe('Stats Service', () => {
  let outsideTemperatureService: jest.Mocked<OutsideTemperatureService>;
  let waterTemperatureService: jest.Mocked<WaterTemperatureService>;
  let boxTemperatureService: jest.Mocked<BoxTemperatureService>;
  let motorService: jest.Mocked<MotorService>;
  let loggerService: jest.Mocked<CustomLoggerService>;
  let schedulerRegistry: jest.Mocked<SchedulerRegistry>;
  let smartSystemService: SmartSystemService;

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

    boxTemperatureService = {
      takeTemperature: jest.fn().mockResolvedValue({ temperature: 9 }),
    } as any;

    motorService = {
      on: jest.fn(),
      off: jest.fn(),
    } as any;

    schedulerRegistry = {
      addTimeout: jest.fn(),
    } as any;

    smartSystemService = new SmartSystemService(
      loggerService,
      outsideTemperatureService,
      waterTemperatureService,
      boxTemperatureService,
      motorService,
      schedulerRegistry,
    );
  });

  describe('startWaterPump', () => {
    it('starts the water pump', async () => {
      expect(motorService.on).not.toHaveBeenCalled();
      await expect(
        smartSystemService.startWaterPump(),
      ).resolves.toBeUndefined();
      expect(motorService.on).toHaveBeenCalledTimes(1);
      expect(motorService.on).toHaveBeenCalledWith('water');
    });

    it('forwards the error', async () => {
      motorService.on.mockImplementation(() => {
        throw new Error('Fake');
      });
      await expect(smartSystemService.startWaterPump()).rejects.toThrowError(
        'Fake',
      );
    });

    it('does not start the pump wen the smart system is disabled', async () => {
      expect(motorService.on).not.toHaveBeenCalled();
      smartSystemService.enableSmartSystem = false;
      await expect(
        smartSystemService.startWaterPump(),
      ).resolves.toBeUndefined();
      expect(motorService.on).not.toHaveBeenCalled();
    });

    it('sets a cron job every day at noon', async () => {
      expect(Cron).toHaveBeenCalled();
      expect((Cron as jest.Mock).mock.calls[0]).toEqual([
        CronExpression.EVERY_DAY_AT_NOON,
      ]);
      expect((Cron as jest.Mock).mock.results[0].value).toHaveBeenCalledTimes(
        1,
      );
      expect((Cron as jest.Mock).mock.results[0].value).toHaveBeenCalledWith(
        {},
        'startWaterPump',
        expect.anything(),
      );
    });
  });

  describe('stopWaterPump', () => {
    it('starts the water pump', async () => {
      expect(motorService.off).not.toHaveBeenCalled();
      await expect(smartSystemService.stopWaterPump()).resolves.toBeUndefined();
      expect(motorService.off).toHaveBeenCalledTimes(1);
      expect(motorService.off).toHaveBeenCalledWith('water');
    });

    it('forwards the error', async () => {
      motorService.off.mockImplementation(() => {
        throw new Error('Fake');
      });
      await expect(smartSystemService.stopWaterPump()).rejects.toThrowError(
        'Fake',
      );
    });

    it('does not stop the pump wen the smart system is disabled', async () => {
      expect(motorService.off).not.toHaveBeenCalled();
      smartSystemService.enableSmartSystem = false;
      await expect(smartSystemService.stopWaterPump()).resolves.toBeUndefined();
      expect(motorService.off).not.toHaveBeenCalled();
    });
    it('sets a cron job every day at 4pm', async () => {
      expect(Cron).toHaveBeenCalled();
      expect((Cron as jest.Mock).mock.calls[1]).toEqual([
        CronExpression.EVERY_DAY_AT_4PM,
      ]);
      expect((Cron as jest.Mock).mock.results[1].value).toHaveBeenCalledTimes(
        1,
      );
      expect((Cron as jest.Mock).mock.results[1].value).toHaveBeenCalledWith(
        {},
        'stopWaterPump',
        expect.anything(),
      );
    });
  });
});
