import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultOutsideTemperature1588594210325
  implements MigrationInterface {
  name = 'AddDefaultOutsideTemperature1588594210325';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "outside-temperature" ALTER COLUMN "id" SET DEFAULT nextval('outside-temperature_id_seq')`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "outside-temperature" ALTER COLUMN "id" DROP DEFAULT`,
      undefined,
    );
  }
}
