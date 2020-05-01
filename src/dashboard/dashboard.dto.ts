import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class PutSensorDto {
  @IsString()
  public readonly id!: string;

  @IsBoolean()
  @IsOptional()
  public readonly checked?: boolean;
}
