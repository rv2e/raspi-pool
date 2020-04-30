import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemperatureBox1588262294018 implements MigrationInterface {
  name = 'AddTemperatureBox1588262294018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "box-temperature" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "temperature" double precision NOT NULL, CONSTRAINT "PK_7c69b94336654229ec1d19af895" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_48c7fa06c0a709dd0f5af95f3a" ON "box-temperature" ("updatedAt") `,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1b3d7e053212a9f604a0f3076a" ON "box-temperature" ("deletedAt") `,
      undefined,
    );
    await queryRunner.query(
      `CREATE SEQUENCE "outside-temperature_id_seq" OWNED BY "outside-temperature"."id"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "outside-temperature" ALTER COLUMN "id" SET DEFAULT nextval('outside-temperature_id_seq')`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "outside-temperature" ALTER COLUMN "id" DROP DEFAULT`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "outside-temperature" ALTER COLUMN "id" SET DEFAULT nextval('temperature_id_seq'`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "outside-temperature" ALTER COLUMN "id" DROP DEFAULT`,
      undefined,
    );
    await queryRunner.query(
      `DROP SEQUENCE "outside-temperature_id_seq"`,
      undefined,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_1b3d7e053212a9f604a0f3076a"`,
      undefined,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_48c7fa06c0a709dd0f5af95f3a"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "box-temperature"`, undefined);
  }
}
