import rpio from 'rpio';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config/config.service';
import { CustomLoggerService } from 'logger/logger.service';

export type Motor = 'heating' | 'water';

@Injectable()
export class MotorService {
  private readonly motors: { [key in Motor]: number };

  constructor(
    private readonly logger: CustomLoggerService,
    private readonly config: ConfigService,
  ) {
    this.motors = {
      heating: this.config.get('heatingPump'),
      water: this.config.get('waterPump'),
    };
  }

  public read(motor: Motor) {
    try {
      return rpio.read(this.motors[motor]);
    } catch (error) {
      return 0;
    }
  }

  public on(motor: Motor) {
    this.high(this.motors[motor]);
  }

  public off(motor: Motor) {
    this.low(this.motors[motor]);
  }

  private high(pin: number) {
    rpio.open(pin, rpio.OUTPUT, rpio.HIGH);
  }

  private low(pin: number) {
    rpio.open(pin, rpio.OUTPUT, rpio.LOW);
  }
}
