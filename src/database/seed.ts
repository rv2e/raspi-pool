import { Connection, createConnection, getConnectionManager } from 'typeorm';

import databaseConfig from './config';
import { OutsideTemperatureEntity } from 'temperature/outside-temperature.entity';
import { WaterTemperatureEntity } from 'temperature/water-temperature.entity';
import { BoxTemperatureEntity } from 'temperature/box-temperature.entity';

const clean = async (connection: Connection) => {
  if (!connection.isConnected) {
    await connection.connect();
  }
  await connection.dropDatabase();
  await connection.synchronize(true);
};

const seedFixtures = async (connection: Connection) => {
  const outsideTemperatures = connection.manager.create(
    OutsideTemperatureEntity,
    [
      {
        createdAt: new Date(2019, 8, 10, 15, 32, 16),
        id: 1,
        temperature: 25,
        updatedAt: new Date(2019, 8, 10, 15, 32, 16),
      },
    ] as Partial<OutsideTemperatureEntity>[],
  );

  const waterTemperatures = connection.manager.create(WaterTemperatureEntity, [
    {
      createdAt: new Date(2019, 8, 10, 15, 32, 16),
      id: 1,
      temperature: 28,
      updatedAt: new Date(2019, 8, 10, 15, 32, 16),
    },
  ] as Partial<OutsideTemperatureEntity>[]);

  const boxTemperatures = connection.manager.create(BoxTemperatureEntity, [
    {
      createdAt: new Date(2019, 8, 10, 15, 32, 16),
      id: 1,
      temperature: 22,
      updatedAt: new Date(2019, 8, 10, 15, 32, 16),
    },
  ] as Partial<BoxTemperatureEntity>[]);

  await connection.manager.save(outsideTemperatures);
  await connection.manager.save(waterTemperatures);
  await connection.manager.save(boxTemperatures);
};

export const seed = async (fixtures = seedFixtures) => {
  let connection: Connection;

  try {
    connection = getConnectionManager().get();
  } catch (ex) {
    connection = await createConnection(databaseConfig);
  }

  await clean(connection);
  await fixtures(connection);
  return connection;
};
