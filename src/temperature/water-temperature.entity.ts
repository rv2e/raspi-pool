import { BaseEntity } from 'lib/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('water-temperature')
export class WaterTemperatureEntity extends BaseEntity {
  public static comment =
    'Water Temperature model. This model defines all the temperatures taken during a period.';

  @Column('float', { comment: 'Temperature in degrees', nullable: false })
  public temperature!: number;
}
