import { ConfigService } from 'config/config.service';

const getDatabaseConfig = (configService = new ConfigService()) => {
  return {
    ...configService.get('database'),
    cli: { migrationsDir: `./src/database/migrations` },
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    keepConnectionAlive: true,
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  };
};

export = getDatabaseConfig();
