import { join } from 'path';

import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { TemperatureService } from 'temperature/temperature.service';
import { AppModule } from 'app.module';

describe('Dashboard Controller', () => {
  let app: NestExpressApplication;
  let temperatureService: jest.Mock<TemperatureService>;

  beforeEach(async () => {
    temperatureService = {
      getLastData: jest.fn().mockReturnValue({
        date: new Date(2019, 8, 10, 15, 32, 16),
        temperature: 32,
      }),
    } as any;
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TemperatureService)
      .useValue(temperatureService)
      .compile();

    app = module.createNestApplication();
    app.setBaseViewsDir(join(__dirname, '../..', 'views'));
    app.setViewEngine('ejs');

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /dashboard', () => {
    it('returns the dashboard page', async () => {
      const result = await request(app.getHttpServer()).get('/status');
      expect(result.status).toEqual(200);
      expect(result.text).toMatchInlineSnapshot(`
        "<!DOCTYPE html>
        <html>

        <head>
          <meta charset=\\"utf-8\\" />
          <title>Raspi-pool</title>
        </head>

        <body>
          <h1>Welcome to the Pool status page:</h1>

          <p>The last value of the temperature sensor: 32℃ at
            2019-09-10T13:32:16.000Z </p>

        </body>

        </html>
        "
      `);
    });
  });
});
