import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWaterTemperature1588195986521 implements MigrationInterface {
  name = 'AddWaterTemperature1588195986521';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('temperature', 'outside-temperature');

    await queryRunner.query(
      `CREATE TABLE "water-temperature" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "temperature" double precision NOT NULL, CONSTRAINT "PK_839a1b9c9e54b9b3b87de31cbae" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_14f27a5d95966c48a760877c70" ON "water-temperature" ("updatedAt") `,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4d8125fc6e0f968fa3de46511" ON "water-temperature" ("deletedAt") `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_e4d8125fc6e0f968fa3de46511"`,
      undefined,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_14f27a5d95966c48a760877c70"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "water-temperature"`, undefined);
    await queryRunner.renameTable('outside-temperature', 'temperature');
  }
}
