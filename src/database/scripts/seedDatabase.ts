import { seed } from 'database/seed';

seed()
  .then(connection => connection.close())
  .then(() => process.exit(0))
  .catch((error: Error) => {
    // eslint-disable-next-line no-console
    console.log(error);
    process.exit(1);
  });
