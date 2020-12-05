import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingTwoFactorSchemas1606812611196 implements MigrationInterface {
    name = 'AddingTwoFactorSchemas1606812611196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "two_fa" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "secret" character varying NOT NULL, CONSTRAINT "PK_b4f9273efa45b05638fbf22562b" PRIMARY KEY ("uuid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "two_fa"`);
    }

}
