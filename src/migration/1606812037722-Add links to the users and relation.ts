import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLinksToTheUsersAndRelation1606812037722 implements MigrationInterface {
    name = 'AddLinksToTheUsersAndRelation1606812037722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "link" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "platform" character varying NOT NULL, "platformId" character varying NOT NULL, "userUuid" uuid, CONSTRAINT "PK_2db937642cc2c8be21fe5389b4b" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_6d52d5f164ede4768d88a945886" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_6d52d5f164ede4768d88a945886"`);
        await queryRunner.query(`DROP TABLE "link"`);
    }

}
