import { Gpio } from 'onoff';
import { Injectable } from '@nestjs/common';
import { ConfigService } from 'config/config.service';
import { CustomLoggerService } from 'logger/logger.service';

export type Light = 'pool' | 'tree';

@Injectable()
export class LightService {
  private readonly lights: { [key in Light]: number };

  constructor(
    private readonly logger: CustomLoggerService,
    private readonly config: ConfigService,
  ) {
    this.lights = {
      pool: this.config.get('poolLight'),
      tree: this.config.get('treeLight'),
    };
  }

  public read(light: Light) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gpio = new Gpio(this.lights[light], '' as any);
      return gpio.readSync();
    } catch (error) {
      return 0;
    }
  }

  public off(light: Light) {
    this.high(this.lights[light]);
  }

  public on(light: Light) {
    this.low(this.lights[light]);
  }

  private high(pin: number) {
    new Gpio(pin, 'high');
  }

  private low(pin: number) {
    new Gpio(pin, 'low');
  }
}
