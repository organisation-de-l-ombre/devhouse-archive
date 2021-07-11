import { MigrationInterface, QueryRunner } from "typeorm";

export class movieTitle1626013486173 implements MigrationInterface {
  name = "movieTitle1626013486173";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "localized_movie" ADD "background" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "localized_movie" ADD "quotation" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "localized_movie" ADD "trailer" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title" ADD "duration" integer NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movie_title" DROP COLUMN "duration"`);
    await queryRunner.query(
      `ALTER TABLE "localized_movie" DROP COLUMN "trailer"`
    );
    await queryRunner.query(
      `ALTER TABLE "localized_movie" DROP COLUMN "quotation"`
    );
    await queryRunner.query(
      `ALTER TABLE "localized_movie" DROP COLUMN "background"`
    );
  }
}
