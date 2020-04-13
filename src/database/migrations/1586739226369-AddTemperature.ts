import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTemperature1586739226369 implements MigrationInterface {
    name = 'AddTemperature1586739226369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temperature" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "temperature" double precision NOT NULL, CONSTRAINT "PK_3b69dc45d57daf28f4b930eb4c9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_3b4107af46fdaf49a6afb206e4" ON "temperature" ("updatedAt") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_f7c3515ad58957aa309240cde5" ON "temperature" ("deletedAt") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_f7c3515ad58957aa309240cde5"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_3b4107af46fdaf49a6afb206e4"`, undefined);
        await queryRunner.query(`DROP TABLE "temperature"`, undefined);
    }

}
