import { BaseEntity } from 'lib/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('box-temperature')
export class BoxTemperatureEntity extends BaseEntity {
  public static comment =
    'Box Temperature model. This model defines all the temperatures taken during a period.';

  @Column('float', { comment: 'Temperature in degrees', nullable: false })
  public temperature!: number;
}
