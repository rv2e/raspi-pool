import { init as initSentry } from '@sentry/node';

import { IConfig } from './config.interface';
import { ConfigService } from './config.service';

jest.mock('@sentry/node');

describe('Config Service', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService('test');
  });

  it('exposes isProductionEnvironment', () => {
    expect(configService.isProductionEnvironment).toBe(false);
  });

  it.each([
    ['appName', 'raspi-pool'],
    [
      'database',
      {
        database: 'raspi-pool-test',
        host: expect.any(String),
        password: expect.any(String),
        port: 5432,
        type: 'postgres',
        username: expect.any(String),
      },
    ],
    ['environment', 'test'],
    ['port', 3000],
    ['sentryDSN', undefined],
    ['release', 'release-not-found'],
  ] as [keyof IConfig, unknown][])('exposes %s', (key, value) => {
    expect(configService.get(key)).toEqual(value);
  });

  it('sets up Sentry when a dsn is provided', () => {
    const OLD_DSN = process.env.SENTRY_DSN;
    const OLD_RELEASE = process.env.RELEASE;
    process.env.SENTRY_DSN = 'FAKE_DSN';
    process.env.RELEASE = 'FAKE_RELEASE';
    expect(initSentry).not.toHaveBeenCalled();
    configService = new ConfigService('test');
    expect(initSentry).toHaveBeenCalledTimes(1);
    expect(initSentry).toHaveBeenCalledWith({
      dsn: 'FAKE_DSN',
      environment: 'test',
      release: 'FAKE_RELEASE',
    });
    process.env.SENTRY_DSN = OLD_DSN;
    process.env.RELEASE = OLD_RELEASE;
  });
});
