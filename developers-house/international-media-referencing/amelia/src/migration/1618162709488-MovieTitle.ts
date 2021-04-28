// eslint-disable-next-line unicorn/filename-case
import { MigrationInterface, QueryRunner } from "typeorm";

export class MovieTitle1618162709488 implements MigrationInterface {
  name = "MovieTitle1618162709488";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "language" ("id" SERIAL NOT NULL, "language" character varying NOT NULL, CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "movie_title" ("id" character varying NOT NULL, "name" character varying NOT NULL, "poster" character varying NOT NULL, "releaseDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_bfd8a241854785fa9277460adeb" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "movie_title_companies_company" ("movieTitleId" character varying NOT NULL, "companyId" integer NOT NULL, CONSTRAINT "PK_d15a268a9b4c26a567c5b105ae7" PRIMARY KEY ("movieTitleId", "companyId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f265dea2bc413bac353cde3e0a" ON "movie_title_companies_company" ("movieTitleId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_748ebc15ea31377a9f2624d809" ON "movie_title_companies_company" ("companyId") `
    );
    await queryRunner.query(
      `CREATE TABLE "movie_title_tags_tag" ("movieTitleId" character varying NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_d2d7f305b57cf437202ddf6eb59" PRIMARY KEY ("movieTitleId", "tagId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5a7545667f0f249252842e6b2d" ON "movie_title_tags_tag" ("movieTitleId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_31fdec03611df037d13f2ba47d" ON "movie_title_tags_tag" ("tagId") `
    );
    await queryRunner.query(
      `CREATE TABLE "movie_title_available_languages_language" ("movieTitleId" character varying NOT NULL, "languageId" integer NOT NULL, CONSTRAINT "PK_ddb2b91ece8eb39f8634f5141f6" PRIMARY KEY ("movieTitleId", "languageId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a9ec2f1c44055dfac166c55de8" ON "movie_title_available_languages_language" ("movieTitleId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9705a7d9f5ff25d3e20327c3c" ON "movie_title_available_languages_language" ("languageId") `
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title_companies_company" ADD CONSTRAINT "FK_f265dea2bc413bac353cde3e0aa" FOREIGN KEY ("movieTitleId") REFERENCES "movie_title"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title_companies_company" ADD CONSTRAINT "FK_748ebc15ea31377a9f2624d8094" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title_tags_tag" ADD CONSTRAINT "FK_5a7545667f0f249252842e6b2d0" FOREIGN KEY ("movieTitleId") REFERENCES "movie_title"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title_tags_tag" ADD CONSTRAINT "FK_31fdec03611df037d13f2ba47d8" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title_available_languages_language" ADD CONSTRAINT "FK_a9ec2f1c44055dfac166c55de89" FOREIGN KEY ("movieTitleId") REFERENCES "movie_title"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title_available_languages_language" ADD CONSTRAINT "FK_c9705a7d9f5ff25d3e20327c3c7" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_title_available_languages_language" DROP CONSTRAINT "FK_c9705a7d9f5ff25d3e20327c3c7"`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title_available_languages_language" DROP CONSTRAINT "FK_a9ec2f1c44055dfac166c55de89"`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title_tags_tag" DROP CONSTRAINT "FK_31fdec03611df037d13f2ba47d8"`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title_tags_tag" DROP CONSTRAINT "FK_5a7545667f0f249252842e6b2d0"`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title_companies_company" DROP CONSTRAINT "FK_748ebc15ea31377a9f2624d8094"`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title_companies_company" DROP CONSTRAINT "FK_f265dea2bc413bac353cde3e0aa"`
    );
    await queryRunner.query(`DROP INDEX "IDX_c9705a7d9f5ff25d3e20327c3c"`);
    await queryRunner.query(`DROP INDEX "IDX_a9ec2f1c44055dfac166c55de8"`);
    await queryRunner.query(
      `DROP TABLE "movie_title_available_languages_language"`
    );
    await queryRunner.query(`DROP INDEX "IDX_31fdec03611df037d13f2ba47d"`);
    await queryRunner.query(`DROP INDEX "IDX_5a7545667f0f249252842e6b2d"`);
    await queryRunner.query(`DROP TABLE "movie_title_tags_tag"`);
    await queryRunner.query(`DROP INDEX "IDX_748ebc15ea31377a9f2624d809"`);
    await queryRunner.query(`DROP INDEX "IDX_f265dea2bc413bac353cde3e0a"`);
    await queryRunner.query(`DROP TABLE "movie_title_companies_company"`);
    await queryRunner.query(`DROP TABLE "movie_title"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "language"`);
    await queryRunner.query(`DROP TABLE "company"`);
  }
}
