import {MigrationInterface, QueryRunner} from "typeorm";

export class UsersSchema1606811745262 implements MigrationInterface {
    name = 'UsersSchema1606811745262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "private" boolean NOT NULL, "roles" integer NOT NULL, "avatar" character varying NOT NULL, "dataCollection" boolean NOT NULL, "premium" boolean NOT NULL, "ban" character varying, CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
