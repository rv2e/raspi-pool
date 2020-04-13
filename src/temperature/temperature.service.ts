import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TemperatureEntity } from './temperature.entity';

@Injectable()
export class TemperatureService {
  private lastData: { date: Date; temperature: number } | undefined;
  private takingTemperature = false;

  constructor(
    @InjectRepository(TemperatureEntity)
    private readonly temperatureRepository: Repository<TemperatureEntity>,
  ) {}

  public getLastData() {
    return this.lastData;
  }

  public async takeTemperature() {
    const temperature = await this.getTemperature();
    const temperatureEntity = await this.temperatureRepository.save({
      temperature,
    });
    this.lastData = {
      date: temperatureEntity.createdAt,
      temperature: temperatureEntity.temperature,
    };

    return temperatureEntity;
  }

  private async getTemperature() {
    if (this.takingTemperature) {
      throw new Error(
        'Already taking the temperature. Concurrency is not allowed.',
      );
    }
    this.takingTemperature = true;
    // TODO use lib to get the temperature
    const temperature = 42;
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.takingTemperature = false;
    return temperature;
  }
}
