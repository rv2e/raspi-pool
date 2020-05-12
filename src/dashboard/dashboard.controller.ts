import {
  Controller,
  Get,
  Render,
  Put,
  Body,
  NotImplementedException,
} from '@nestjs/common';
import { CustomLoggerService } from 'logger/logger.service';
import { OutsideTemperatureService } from 'temperature/outside-temperature.service';
import { WaterTemperatureService } from 'temperature/water-temperature.service';
import { BoxTemperatureService } from 'temperature/box-temperature.service';
import { LightService } from 'light/light.service';
import { MotorService } from 'motors/motor.service';
import { PutSensorDto } from './dashboard.dto';
import { VerticalActuatorService } from 'vertical-actuator/vertical-actuator.service';

@Controller('/')
export class DashboardController {
  constructor(
    private readonly customLoggerService: CustomLoggerService,
    private readonly outsideTemperatureService: OutsideTemperatureService,
    private readonly waterTemperatureService: WaterTemperatureService,
    private readonly boxTemperatureService: BoxTemperatureService,
    private readonly lightService: LightService,
    private readonly motorService: MotorService,
    private readonly verticalActuatorService: VerticalActuatorService,
  ) {}

  @Put('/api/sensor')
  public async updateSensor(@Body() body: PutSensorDto) {
    switch (body.id) {
      case 'pool-light':
        return body.checked
          ? this.lightService.off('pool')
          : this.lightService.on('pool');
      case 'tree-light':
        return body.checked
          ? this.lightService.off('tree')
          : this.lightService.on('tree');
      case 'water-motor':
        return body.checked
          ? this.motorService.off('water')
          : this.motorService.on('water');
      case 'heating-motor':
        return body.checked
          ? this.motorService.off('heating')
          : this.motorService.on('heating');
      case 'actuator-up':
        return this.verticalActuatorService.up();
      case 'actuator-down':
        return this.verticalActuatorService.down();
      case 'actuator-stop':
        return this.verticalActuatorService.stop();
      default:
        throw new NotImplementedException("The sensor doesn't exist.");
    }
  }

  @Get('/status')
  @Render('dashboard')
  public async renderDashboard() {
    const [
      outsideTemperatureEntities,
      waterTemperatureEntities,
      boxTemperatureEntities,
    ] = await Promise.all([
      this.outsideTemperatureService.getLastWeekMetrics(),
      this.waterTemperatureService.getLastWeekMetrics(),
      this.boxTemperatureService.getLastWeekMetrics(),
    ]);

    const motorStatus = {
      heating: this.motorService.read('heating'),
      water: this.motorService.read('water'),
    };
    const lightStatus = {
      pool: this.lightService.read('pool'),
      tree: this.lightService.read('tree'),
    };
    return {
      lightStatus,
      motorStatus,
      lastBoxTemperature: boxTemperatureEntities.slice(-1)[0],
      lastWaterTemperature: waterTemperatureEntities.slice(-1)[0],
      lastOutsideTemperature: outsideTemperatureEntities.slice(-1)[0],
      plotly: [
        {
          type: 'scatter',
          mode: 'lines',
          name: 'Outside Temperature',
          line: { color: 'red' },
          x: outsideTemperatureEntities.map(({ createdAt }) => createdAt),
          y: outsideTemperatureEntities.map(({ temperature }) => temperature),
        },
        {
          type: 'scatter',
          mode: 'lines',
          name: 'Box Temperature',
          line: { color: 'orange' },
          x: boxTemperatureEntities.map(({ createdAt }) => createdAt),
          y: boxTemperatureEntities.map(({ temperature }) => temperature),
        },
        {
          type: 'scatter',
          mode: 'lines',
          name: 'Water Temperature',
          line: { color: 'black' },
          x: waterTemperatureEntities.map(({ createdAt }) => createdAt),
          y: waterTemperatureEntities.map(({ temperature }) => temperature),
        },
      ],
    };
  }
}
