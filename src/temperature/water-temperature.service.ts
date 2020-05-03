import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { WaterTemperatureEntity } from './water-temperature.entity';
import { ConfigService } from 'config/config.service';
import sensor from 'ds18b20-raspi';

@Injectable()
export class WaterTemperatureService {
  private takingTemperature = false;

  constructor(
    @InjectRepository(WaterTemperatureEntity)
    private readonly temperatureRepository: Repository<WaterTemperatureEntity>,
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
    const WaterTemperatureEntity = await this.temperatureRepository.save({
      temperature,
    });

    return WaterTemperatureEntity;
  }

  private async getTemperature(): Promise<number> {
    if (this.takingTemperature) {
      throw new Error(
        'Already taking the water temperature. Concurrency is not allowed.',
      );
    }

    this.takingTemperature = true;
    try {
      const { deviceSerial, w1Directory } = this.config.get(
        'waterTemperatureSensor',
      );
      const temperature = await new Promise<number>(async (resolve, reject) => {
        const timeout = setTimeout(
          () =>
            reject(
              new Error(
                'Timeout has been reached to get the water temperature.',
              ),
            ),
          30 * 1000,
        );

        sensor.setW1Directory(w1Directory);
        sensor.readC(deviceSerial, 2, (error, temperature) => {
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
      throw new Error(`Failed to get the water temperature: ${error.message}`);
    }
  }
}
