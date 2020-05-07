import { Gpio } from 'onoff';
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
      const gpio = new Gpio(this.motors[motor], 'in');
      return gpio.readSync();
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
    new Gpio(pin, 'high');
  }

  private low(pin: number) {
    new Gpio(pin, 'low');
  }
}
