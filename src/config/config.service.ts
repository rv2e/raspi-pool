/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as fs from 'fs';

import { init as initSentry } from '@sentry/node';
import * as dotenv from 'dotenv';
import * as _ from 'lodash';

import { IConfig } from './config.interface';

export class ConfigService {
  private readonly envConfig: IConfig;

  constructor(env: string | undefined = process.env.NODE_ENV) {
    const filePath = env === 'test' ? '.env.test' : '.env';
    const parsedConfig = _.defaults(
      {},
      process.env,
      dotenv.parse(fs.readFileSync(filePath)),
    );

    this.envConfig = {
      appName: 'raspi-pool',
      database: {
        database: parsedConfig.DATABASE_NAME!,
        host: parsedConfig.DATABASE_HOST!,
        password: parsedConfig.DATABASE_PASSWORD!,
        port: parsedConfig.DATABASE_PORT
          ? Number(parsedConfig.DATABASE_PORT)
          : 5432,
        type: 'postgres',
        username: parsedConfig.DATABASE_USER!,
      },
      environment: parsedConfig.NODE_ENV || 'local',
      port: parsedConfig.PORT ? Number(parsedConfig.PORT) : 3000,
      release: _.isString(parsedConfig.RELEASE)
        ? parsedConfig.RELEASE
        : 'release-not-found',
      sentryDSN: parsedConfig.SENTRY_DSN,
    };

    this.setupSentry();
  }

  public get<K extends keyof IConfig>(key: K): IConfig[K] {
    return this.envConfig[key];
  }

  public get isProductionEnvironment() {
    return this.envConfig.environment.startsWith('prod');
  }

  private setupSentry() {
    const dsn = this.get('sentryDSN');
    if (dsn !== undefined) {
      initSentry({
        dsn,
        environment: this.get('environment'),
        release: this.get('release'),
      });
    }
  }
}
