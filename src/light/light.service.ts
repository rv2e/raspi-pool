import rpio from 'rpio';
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

  public on(light: Light) {
    this.high(this.lights[light]);
  }

  public off(light: Light) {
    this.low(this.lights[light]);
  }

  private high(pin: number) {
    rpio.open(pin, rpio.OUTPUT, rpio.HIGH);
  }

  private low(pin: number) {
    rpio.open(pin, rpio.OUTPUT, rpio.LOW);
  }
}
