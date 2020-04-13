import { Connection, createConnection, getConnectionManager } from 'typeorm';

import databaseConfig from './config';
import { TemperatureEntity } from 'temperature/temperature.entity';

const clean = async (connection: Connection) => {
  if (!connection.isConnected) {
    await connection.connect();
  }
  await connection.dropDatabase();
  await connection.synchronize(true);
};

const seedFixtures = async (connection: Connection) => {
  const temperatures = connection.manager.create(TemperatureEntity, [
    {
      createdAt: new Date(2019, 8, 10, 15, 32, 16),
      id: 1,
      temperature: 25,
      updatedAt: new Date(2019, 8, 10, 15, 32, 16),
    },
  ] as Partial<TemperatureEntity>[]);
  await connection.manager.save(temperatures);
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
