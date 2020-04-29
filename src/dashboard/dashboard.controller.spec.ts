import { join } from 'path';

import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { OutsideTemperatureService } from 'temperature/outside-temperature.service';
import { AppModule } from 'app.module';

describe('Dashboard Controller', () => {
  let app: NestExpressApplication;
  let outsideTemperatureService: jest.Mock<OutsideTemperatureService>;

  beforeEach(async () => {
    outsideTemperatureService = {
      getLastWeekMetrics: jest.fn().mockResolvedValue([
        {
          createdAt: new Date(2019, 8, 10, 15, 32, 16),
          temperature: 32,
        },
        {
          createdAt: new Date(2020, 8, 10, 15, 32, 16),
          temperature: 32,
        },
      ]),
    } as any;
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OutsideTemperatureService)
      .useValue(outsideTemperatureService)
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
          <script src=\\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.js\\"></script>

          <title>Raspi-pool</title>
        </head>

        <body>
          <h1>Welcome to the Pool status page:</h1>
          
            <p>The last value of the temperature sensor: 32.0℃ at
            9/10/2020, 15:32:16 </p>
          

          <div style=\\"width:75%;\\">
            <canvas id=\\"myChart\\"></canvas>
            <script>
              var ctx = document.getElementById('myChart').getContext('2d');
              var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: [\\"2019-09-10T13:32:16.000Z\\",\\"2020-09-10T13:32:16.000Z\\"],
                  datasets: [{
                    label: 'Temperature over time',
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    broderColor: 'rgb(255, 99, 132)',
                    data: [{\\"x\\":\\"2019-09-10T13:32:16.000Z\\",\\"y\\":32},{\\"x\\":\\"2020-09-10T13:32:16.000Z\\",\\"y\\":32}],
                  }]
                },
                options: {
                  responsive: true,
                  title: {
                    display: true,
                    text: 'Evolution of the temperature in degrees over the last week.'
                  },
                  tooltips: {
                    mode: 'index',
                    intersect: false,
                  },
                  hover: {
                    mode: 'nearest',
                    intersect: true
                  },
                  scales: {
                    x: {
                      type: 'time',
                      display: true,
                      scaleLabel: {
                        display: true,
                        labelString: 'Date'
                      }
                    },
                    y: {
                      display: true,
                      scaleLabel: {
                        display: true,
                        labelString: 'Degrees'
                      }
                    }
                  }
                }
              });
            </script>
          </div>
        </body>

        </html>
        "
      `);
    });
  });
});
