import {MigrationInterface, QueryRunner} from "typeorm";

export class movieTitle1626014633940 implements MigrationInterface {
    name = 'movieTitle1626014633940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "localized_movie" ALTER COLUMN "background" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "localized_movie" ALTER COLUMN "poster" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "localized_movie" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "localized_movie" ALTER COLUMN "quotation" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "localized_movie" ALTER COLUMN "trailer" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "movie_title" ALTER COLUMN "duration" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_title" ALTER COLUMN "duration" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "localized_movie" ALTER COLUMN "trailer" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "localized_movie" ALTER COLUMN "quotation" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "localized_movie" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "localized_movie" ALTER COLUMN "poster" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "localized_movie" ALTER COLUMN "background" SET NOT NULL`);
    }

}
