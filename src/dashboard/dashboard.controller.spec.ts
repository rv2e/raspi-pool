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
          <script src=\\"https://cdn.jsdelivr.net/npm/chart.js@2.8.0\\"></script>

          <title>Raspi-pool</title>
        </head>

        <body>
          <h1>Welcome to the Pool status page:</h1>
          
            <p>The last value of the temperature sensor: 32.0℃ at
            9/10/2019, 15:32:16 </p>
          

          <div style=\\"width:75%;\\">
            <canvas id=\\"myChart\\"></canvas>
            <script>
              var ctx = document.getElementById('myChart').getContext('2d');
              var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: [\\"10th at 13:32:16\\",\\"10th at 13:32:16\\"],
                  datasets: [{
                    label: 'Temperature',
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    broderColor: 'rgb(255, 99, 132)',
                    data: [\\"32.0\\",\\"32.0\\"],
                  }]
                },
                options: {
                  responsive: true,
                  title: {
                    display: true,
                    text: 'Evolution of the temperature over the last week.'
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
