import { BaseEntity } from 'lib/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('temperature')
export class TemperatureEntity extends BaseEntity {
  public static comment =
    'Temperature model. This model defines all the temperatures taken during a period.';

  @Column('float', { comment: 'Temperature in degrees', nullable: false })
  public temperature!: number;
}
