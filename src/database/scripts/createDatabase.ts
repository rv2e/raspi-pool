import databaseConfig from 'database/config';
import { Connection, createConnection } from 'typeorm';

const createDatabase = async (connection: Connection) => {
  await connection.query(`CREATE DATABASE "${databaseConfig.database}";`);
  await connection.query(
    `GRANT ALL PRIVILEGES ON DATABASE "${databaseConfig.database}" TO ${databaseConfig.username};`,
  );
  connection.close();
};

createConnection({
  ...databaseConfig,
  database: databaseConfig.type,
})
  .then(createDatabase)
  .then(() => process.exit(0))
  .catch((error: Error) => {
    // eslint-disable-next-line no-console
    console.log(error);
    process.exit(1);
  });
