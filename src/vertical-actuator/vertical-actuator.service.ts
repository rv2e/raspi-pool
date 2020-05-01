import rpio from 'rpio';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config/config.service';
import { CustomLoggerService } from 'logger/logger.service';

@Injectable()
export class VerticalActuatorService {
  private readonly verticalActuators: number[][];
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly config: ConfigService,
  ) {
    this.verticalActuators = this.config.get('verticalActuators');
  }

  public up() {
    this.verticalActuators.map(([left, right]) => {
      this.low(left);
      this.high(right);
    });
  }

  public down() {
    this.verticalActuators.map(([left, right]) => {
      this.high(left);
      this.low(right);
    });
  }

  public stop() {
    this.verticalActuators.map(([left, right]) => {
      this.high(left);
      this.high(right);
    });
  }

  private high(pin: number) {
    rpio.open(pin, rpio.OUTPUT, rpio.HIGH);
  }

  private low(pin: number) {
    rpio.open(pin, rpio.OUTPUT, rpio.LOW);
  }
}