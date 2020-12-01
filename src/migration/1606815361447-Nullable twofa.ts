import {MigrationInterface, QueryRunner} from "typeorm";

export class NullableTwofa1606815361447 implements MigrationInterface {
    name = 'NullableTwofa1606815361447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "two_fa" ADD "userUuid" uuid`);
        await queryRunner.query(`ALTER TABLE "two_fa" ADD CONSTRAINT "UQ_9ec1751635d71e1d2090540d4bd" UNIQUE ("userUuid")`);
        await queryRunner.query(`ALTER TABLE "two_fa" ADD CONSTRAINT "FK_9ec1751635d71e1d2090540d4bd" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "two_fa" DROP CONSTRAINT "FK_9ec1751635d71e1d2090540d4bd"`);
        await queryRunner.query(`ALTER TABLE "two_fa" DROP CONSTRAINT "UQ_9ec1751635d71e1d2090540d4bd"`);
        await queryRunner.query(`ALTER TABLE "two_fa" DROP COLUMN "userUuid"`);
    }

}
