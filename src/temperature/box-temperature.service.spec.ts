import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { seed } from 'database/seed';
import { EntityManager, getConnectionManager, Connection } from 'typeorm';
import sensor from 'node-dht-sensor';

import { BoxTemperatureEntity } from './box-temperature.entity';
import { BoxTemperatureService } from './box-temperature.service';
import { AppModule } from 'app.module';

jest.mock('node-dht-sensor', () => ({ read: jest.fn() }));

const seedFixtures = async (connection: Connection) => {
  const temperatures = connection.manager.create(BoxTemperatureEntity, [
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
  ] as Partial<BoxTemperatureEntity>[]);
  await connection.manager.save(temperatures);
};

describe('Box Temperature Service', () => {
  let app: INestApplication;
  let boxTemperatureService: BoxTemperatureService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    (sensor.read as jest.Mock).mockImplementation((model, pin, cb) =>
      cb(null, 42, 30),
    );

    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    await seed(seedFixtures);
    boxTemperatureService = app.get(BoxTemperatureService);

    entityManager = getConnectionManager().get().manager;
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    await app.close();
  });

  describe('getLastWeekMetrics', () => {
    it('returns all the temperatures of the last week', async () => {
      await expect(entityManager.count(BoxTemperatureEntity)).resolves.toBe(3);

      // Force to have an old temperature
      const today = new Date();
      await entityManager
        .getRepository(BoxTemperatureEntity)
        .createQueryBuilder('box-temperature')
        .where('"box-temperature".id = 1')
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
        .getRepository(BoxTemperatureEntity)
        .createQueryBuilder('box-temperature')
        .where('"box-temperature".id = 2')
        .update({
          createdAt: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1,
          ),
        })
        .execute();

      await expect(boxTemperatureService.getLastWeekMetrics()).resolves.toEqual(
        [
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
        ],
      );
    });

    it('throws an error if something fails', async () => {
      jest.spyOn(entityManager, 'find').mockRejectedValue(new Error('Fake'));
      await expect(boxTemperatureService.getLastWeekMetrics()).rejects.toThrow(
        'Fake',
      );
    });
  });
  describe('takeTemperature', () => {
    it('returns the temperature entity', async () => {
      expect(sensor.read).not.toHaveBeenCalled();
      await expect(boxTemperatureService.takeTemperature()).resolves.toEqual({
        createdAt: expect.any(Date),
        deletedAt: null,
        id: 4,
        temperature: 42,
        updatedAt: expect.any(Date),
      });
      expect(sensor.read).toHaveBeenCalledTimes(1);
      expect(sensor.read).toHaveBeenCalledWith(11, 4, expect.any(Function));
    });

    it('stores the temperature into the database', async () => {
      const countEntities = await entityManager.count(BoxTemperatureEntity);
      await expect(
        boxTemperatureService.takeTemperature(),
      ).resolves.toBeDefined();
      await expect(entityManager.count(BoxTemperatureEntity)).resolves.toBe(
        countEntities + 1,
      );
    });

    it('throws an error when multiple access are done on the sensor', async () => {
      const temperaturePromise = boxTemperatureService.takeTemperature();
      await expect(boxTemperatureService.takeTemperature()).rejects.toThrow(
        'Already taking the box temperature',
      );
      await expect(temperaturePromise).resolves.toBeDefined();
    });

    it('throws an error when the sensor fails to get the temperature', async () => {
      (sensor.read as jest.Mock).mockImplementation((module, pin, cb) =>
        cb(new Error('fake')),
      );
      expect(sensor.read).not.toHaveBeenCalled();
      await expect(boxTemperatureService.takeTemperature()).rejects.toThrow(
        'Failed to get the box temperature: fake',
      );
      expect(sensor.read).toHaveBeenCalledTimes(1);
    });
  });
});
