import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CustomLoggerService } from 'logger/logger.service';
import { OutsideTemperatureService } from 'temperature/outside-temperature.service';
import { WaterTemperatureService } from 'temperature/water-temperature.service';
import { BoxTemperatureService } from 'temperature/box-temperature.service';
import { MotorService } from 'motors/motor.service';

@Injectable()
export class SmartSystemService {
  static readonly STOP_WATER_TIMEOUT_NAME = 'STOP_WATER_TIMEOUT_NAME';

  public enableSmartSystem = true;

  constructor(
    private readonly customLoggerService: CustomLoggerService,
    private readonly outsideTemperatureService: OutsideTemperatureService,
    private readonly waterTemperatureService: WaterTemperatureService,
    private readonly boxTemperatureService: BoxTemperatureService,
    private readonly motorService: MotorService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  public async startWaterPump() {
    if (!this.enableSmartSystem) {
      return;
    }
    this.motorService.on('water');
  }

  @Cron(CronExpression.EVERY_DAY_AT_4PM)
  public async stopWaterPump() {
    if (!this.enableSmartSystem) {
      return;
    }
    this.motorService.off('water');
  }

  @Cron(CronExpression.EVERY_HOUR)
  public async hourlyCheck() {
    if (!this.enableSmartSystem) {
      return;
    }
    const lastTemperature = await this.outsideTemperatureService.getLastWeekMetrics(
      1,
    );
    if (lastTemperature[0].temperature < 5) {
      this.motorService.on('water');

      const timeout = setTimeout(() => {
        this.motorService.off('water');
      }, 5 * 60 * 1000);

      this.schedulerRegistry.addTimeout(
        SmartSystemService.STOP_WATER_TIMEOUT_NAME,
        timeout,
      );
    }
  }
}
