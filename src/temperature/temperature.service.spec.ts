import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { seed } from 'database/seed';
import { EntityManager, getConnectionManager } from 'typeorm';
import { promises as sensor } from 'node-dht-sensor';

import { TemperatureEntity } from './temperature.entity';
import { TemperatureService } from './temperature.service';
import { AppModule } from 'app.module';

jest.mock('node-dht-sensor');

describe('Temperature Service', () => {
  let app: INestApplication;
  let temperatureService: TemperatureService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    await seed();
    temperatureService = app.get(TemperatureService);

    entityManager = getConnectionManager().get().manager;
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    await app.close();
  });

  describe('getLastData', () => {
    it('returns the last temperature data', async () => {
      await temperatureService.takeTemperature();
      expect(temperatureService.getLastData()).toEqual({
        date: expect.any(Date),
        temperature: expect.any(Number),
      });
    });

    it('returns undefined when data are not there yet', async () => {
      expect(temperatureService.getLastData()).toBeUndefined();
    });
  });
  describe('takeTemperature', () => {
    it('returns the temperature entity', async () => {
      expect(sensor.read).not.toHaveBeenCalled();
      await expect(temperatureService.takeTemperature()).resolves.toEqual({
        createdAt: expect.any(Date),
        deletedAt: null,
        id: 2,
        temperature: 42,
        updatedAt: expect.any(Date),
      });
      expect(sensor.read).toHaveBeenCalledTimes(1);
      expect(sensor.read).toHaveBeenCalledWith(11, 4);
    });

    it('stores the temperature into the database', async () => {
      const countEntities = await entityManager.count(TemperatureEntity);
      await expect(temperatureService.takeTemperature()).resolves.toBeDefined();
      await expect(entityManager.count(TemperatureEntity)).resolves.toBe(
        countEntities + 1,
      );
    });

    it('throws an error when multiple access are done on the sensor', async () => {
      const temperaturePromise = temperatureService.takeTemperature();
      await expect(temperatureService.takeTemperature()).rejects.toThrow(
        'Already taking the temperature',
      );
      await expect(temperaturePromise).resolves.toBeDefined();
    });

    it('throws an error when the sensor fails to get the temperature', async () => {
      (sensor.read as jest.Mock).mockRejectedValue(new Error('fake'));
      expect(sensor.read).not.toHaveBeenCalled();
      await expect(temperatureService.takeTemperature()).rejects.toThrow(
        'Failed to get the temperature: fake',
      );
      expect(sensor.read).toHaveBeenCalledTimes(1);
    });
  });
});
