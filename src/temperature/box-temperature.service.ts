import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import sensor from 'node-dht-sensor';
import { BoxTemperatureEntity } from './box-temperature.entity';
import { ConfigService } from 'config/config.service';

@Injectable()
export class BoxTemperatureService {
  private takingTemperature = false;

  constructor(
    @InjectRepository(BoxTemperatureEntity)
    private readonly temperatureRepository: Repository<BoxTemperatureEntity>,
    private readonly config: ConfigService,
  ) {}

  public async getLastWeekMetrics() {
    return this.temperatureRepository.find({
      where: {
        createdAt: Raw(
          alias => `${alias} > CURRENT_TIMESTAMP - INTERVAL '7 day'`,
        ),
      },
      order: { createdAt: 'ASC' },
    });
  }

  public async takeTemperature() {
    const temperature = await this.getTemperature();
    const BoxTemperatureEntity = await this.temperatureRepository.save({
      temperature,
    });

    return BoxTemperatureEntity;
  }

  private async getTemperature(): Promise<number> {
    if (this.takingTemperature) {
      throw new Error(
        'Already taking the box temperature. Concurrency is not allowed.',
      );
    }

    this.takingTemperature = true;
    try {
      const { model, pin } = this.config.get('boxTemperatureSensor');
      const temperature = await new Promise<number>(async (resolve, reject) => {
        const timeout = setTimeout(
          () =>
            reject(
              new Error('Timeout has been reached to get the box temperature.'),
            ),
          30 * 1000,
        );

        sensor.read(model, pin, (error, temperature) => {
          clearTimeout(timeout);
          if (error) {
            return reject(error);
          }
          return resolve(temperature);
        });
      });
      this.takingTemperature = false;
      return temperature;
    } catch (error) {
      this.takingTemperature = false;
      throw new Error(`Failed to get the box temperature: ${error.message}`);
    }
  }
}
