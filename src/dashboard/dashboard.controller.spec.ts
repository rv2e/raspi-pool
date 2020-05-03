import { join } from 'path';

import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { OutsideTemperatureService } from 'temperature/outside-temperature.service';
import { AppModule } from 'app.module';
import { WaterTemperatureService } from 'temperature/water-temperature.service';
import { BoxTemperatureService } from 'temperature/box-temperature.service';

describe('Dashboard Controller', () => {
  let app: NestExpressApplication;
  let outsideTemperatureService: jest.Mock<OutsideTemperatureService>;
  let waterTemperatureService: jest.Mock<WaterTemperatureService>;
  let boxTemperatureService: jest.Mock<BoxTemperatureService>;

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
    boxTemperatureService = {
      getLastWeekMetrics: jest.fn().mockResolvedValue([
        {
          createdAt: new Date(2019, 8, 10, 15, 32, 16),
          temperature: 39,
        },
        {
          createdAt: new Date(2020, 8, 10, 15, 32, 16),
          temperature: 32,
        },
      ]),
    } as any;
    waterTemperatureService = {
      getLastWeekMetrics: jest.fn().mockResolvedValue([
        {
          createdAt: new Date(2019, 8, 10, 15, 32, 16),
          temperature: 13,
        },
        {
          createdAt: new Date(2020, 8, 10, 15, 32, 16),
          temperature: 18,
        },
      ]),
    } as any;
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OutsideTemperatureService)
      .useValue(outsideTemperatureService)
      .overrideProvider(WaterTemperatureService)
      .useValue(waterTemperatureService)
      .overrideProvider(BoxTemperatureService)
      .useValue(boxTemperatureService)
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
          <script src=\\"https://polyfill.io/v3/polyfill.min.js?features=Array.from,Promise,Symbol,Object.setPrototypeOf,Object.getOwnPropertySymbols\\"></script>
          <script src=\\"https://cdn.jsdelivr.net/npm/superagent\\"></script>
          <script src=\\"https://cdn.plot.ly/plotly-latest.min.js\\" charset=\\"utf-8\\"></script>
          <link rel=\\"stylesheet\\" href=\\"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css\\" integrity=\\"sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh\\" crossorigin=\\"anonymous\\">
          <script src=\\"https://code.jquery.com/jquery-3.4.1.slim.min.js\\" integrity=\\"sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n\\" crossorigin=\\"anonymous\\"></script>
          <script src=\\"https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js\\" integrity=\\"sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo\\" crossorigin=\\"anonymous\\"></script>
          <script src=\\"https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js\\" integrity=\\"sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6\\" crossorigin=\\"anonymous\\"></script>
          <link href=\\"https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/css/bootstrap4-toggle.min.css\\" rel=\\"stylesheet\\">
          <script src=\\"https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/js/bootstrap4-toggle.min.js\\"></script>
          <title>Raspi-pool</title>
        </head>

        <body class=\\"container\\">
          <h1 class=\\"text-center\\">Welcome to the Pool status page</h1>

          <div class=\\"row m-3 text-center\\">
            <div class=\\"col-sm-4\\">
              <div class=\\"card\\">
                <div class=\\"card-body\\">
                  <h5 class=\\"card-title\\">Light Controller</h5>
                  <p class=\\"card-text\\">Puts the lights on and off.</p>
                    <div>
                      <div class=\\"m-1\\"><input onchange=\\"updateSensor('pool-light')\\" id=\\"pool-light\\" type=\\"checkbox\\"  data-toggle=\\"toggle\\" data-on=\\"Pool on\\" data-off=\\"Pool off\\" data-onstyle=\\"success\\" data-offstyle=\\"info\\"></div>
                      <div class=\\"m-1\\"><input onchange=\\"updateSensor('tree-light')\\" id=\\"tree-light\\" type=\\"checkbox\\"  data-toggle=\\"toggle\\" data-on=\\"Tree on\\" data-off=\\"Tree off\\" data-onstyle=\\"success\\" data-offstyle=\\"info\\"></div>
                    </div>
                </div>
              </div>
            </div>
            <div class=\\"col-sm-4\\">
              <div class=\\"card\\">
                <div class=\\"card-body\\">
                  <h5 class=\\"card-title\\">Actuator Controller</h5>
                  <p class=\\"card-text\\">Open and close the bench.</p>
                    <div>
                      <button onclick=\\"updateSensor('actuator-up')\\" id=\\"actuator-up\\" type=\\"button\\" class=\\"btn btn-info\\">Up</button>
                      <button onclick=\\"updateSensor('actuator-down')\\" id=\\"actuator-down\\" type=\\"button\\" class=\\"btn btn-info\\">Down</button>
                      <br/>
                      <button onclick=\\"updateSensor('actuator-stop')\\" id=\\"actuator-stop\\" type=\\"button\\" class=\\"btn btn-danger m-1\\">Stop</button>
                    </div>
                </div>
              </div>
            </div>
            <div class=\\"col-sm-4\\">
              <div class=\\"card\\">
                <div class=\\"card-body\\">
                  <h5 class=\\"card-title\\">Pump Controller</h5>
                  <p class=\\"card-text\\">Start and stop the pumps.</p>
                    <div>
                      <div class=\\"m-1\\"><input onchange=\\"updateSensor('water-motor')\\" id=\\"water-motor\\" type=\\"checkbox\\"  data-toggle=\\"toggle\\" data-on=\\"Water on\\" data-off=\\"Water off\\" data-onstyle=\\"success\\" data-offstyle=\\"info\\"></div>
                      <div class=\\"m-1\\"><input onchange=\\"updateSensor('heating-motor')\\" id=\\"heating-motor\\" type=\\"checkbox\\"  data-toggle=\\"toggle\\" data-on=\\"Heating on\\" data-off=\\"Heating off\\" data-onstyle=\\"success\\" data-offstyle=\\"info\\"></div>
                    </div>
                </div>
              </div>
            </div>
          </div>

          <p>
            
              The last value of the water temperature sensor: 18.0℃
              (9/10/2020, 15:32:16).
            
            <br/>
            
              The last value of the outside temperature sensor: 32.0℃
              (9/10/2020, 15:32:16).
            
            <br/>
            
              The last value of the box temperature sensor: 32.0℃
              (9/10/2020, 15:32:16).
            
          </p>

          <div id=\\"myChart\\"></div>
          <script>
            var layout = {
              title: 'Evolution of temperatures in degrees over the last week',
              font: { size: 16 }
            };
            Plotly.newPlot('myChart', [{\\"type\\":\\"scatter\\",\\"mode\\":\\"lines\\",\\"name\\":\\"Outside Temperature\\",\\"line\\":{\\"color\\":\\"red\\"},\\"x\\":[\\"2019-09-10T13:32:16.000Z\\",\\"2020-09-10T13:32:16.000Z\\"],\\"y\\":[32,32]},{\\"type\\":\\"scatter\\",\\"mode\\":\\"lines\\",\\"name\\":\\"Box Temperature\\",\\"line\\":{\\"color\\":\\"orange\\"},\\"x\\":[\\"2019-09-10T13:32:16.000Z\\",\\"2020-09-10T13:32:16.000Z\\"],\\"y\\":[39,32]},{\\"type\\":\\"scatter\\",\\"mode\\":\\"lines\\",\\"name\\":\\"Water Temperature\\",\\"line\\":{\\"color\\":\\"black\\"},\\"x\\":[\\"2019-09-10T13:32:16.000Z\\",\\"2020-09-10T13:32:16.000Z\\"],\\"y\\":[13,18]}], layout, { responsive: true });
          </script>

          <script>
            function updateSensor(id) {
              var target = document.getElementById(id);
              superagent
                .put('/api/sensor')
                .send({ id, checked: target.checked })
                .end(function (error, res) {
                  if (error) {
                    window.alert(error);
                  }
                });
            }
          </script>
        </body>
        </html>
        "
      `);
    });
  });
});
