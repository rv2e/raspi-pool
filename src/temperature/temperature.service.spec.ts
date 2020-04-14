import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { seed } from 'database/seed';
import { EntityManager, getConnectionManager, Connection } from 'typeorm';
import { promises as sensor } from 'node-dht-sensor';

import { TemperatureEntity } from './temperature.entity';
import { TemperatureService } from './temperature.service';
import { AppModule } from 'app.module';

jest.mock('node-dht-sensor');

const seedFixtures = async (connection: Connection) => {
  const temperatures = connection.manager.create(TemperatureEntity, [
    {
      id: 1,
      temperature: 25,
    },
    {
      id: 2,
      temperature: 29,
    },
    {
      id: 3,
      temperature: 22,
    },
  ] as Partial<TemperatureEntity>[]);
  await connection.manager.save(temperatures);
};

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
    await seed(seedFixtures);
    temperatureService = app.get(TemperatureService);

    entityManager = getConnectionManager().get().manager;
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    await app.close();
  });

  describe('getLastWeekMetrics', () => {
    it('returns all the temperatures of the last week', async () => {
      await expect(entityManager.count(TemperatureEntity)).resolves.toBe(3);

      // Force to have an old temperature
      const today = new Date();
      await entityManager
        .createQueryBuilder(TemperatureEntity, 'temperature')
        .where({ id: 1 })
        .update({
          createdAt: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 7,
          ),
        })
        .execute();

      // Make sure the order is respected
      await entityManager
        .createQueryBuilder(TemperatureEntity, 'temperature')
        .where({ id: 2 })
        .update({
          createdAt: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1,
          ),
        })
        .execute();

      await expect(temperatureService.getLastWeekMetrics()).resolves.toEqual([
        expect.objectContaining({
          createdAt: expect.any(Date),
          temperature: 22,
          id: 3,
        }),
        expect.objectContaining({
          createdAt: expect.any(Date),
          temperature: 29,
          id: 2,
        }),
      ]);
    });

    it('throws an error if something fails', async () => {
      jest.spyOn(entityManager, 'find').mockRejectedValue(new Error('Fake'));
      await expect(temperatureService.getLastWeekMetrics()).rejects.toThrow(
        'Fake',
      );
    });
  });
  describe('takeTemperature', () => {
    it('returns the temperature entity', async () => {
      expect(sensor.read).not.toHaveBeenCalled();
      await expect(temperatureService.takeTemperature()).resolves.toEqual({
        createdAt: expect.any(Date),
        deletedAt: null,
        id: 4,
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
