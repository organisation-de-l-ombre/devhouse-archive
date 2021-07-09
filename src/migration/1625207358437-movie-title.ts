import { MigrationInterface, QueryRunner } from "typeorm";

export class movieTitle1625207358437 implements MigrationInterface {
  name = "movieTitle1625207358437";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "localized_movie" ("id" character varying NOT NULL, "language" character varying NOT NULL, "title" character varying NOT NULL, "releaseDate" TIMESTAMP NOT NULL, "poster" character varying NOT NULL, "description" character varying NOT NULL, "firstAdd" TIMESTAMP NOT NULL, "lastModification" TIMESTAMP NOT NULL, CONSTRAINT "PK_f755220e0cbd6c9071cf55d3956" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "movie_title" ("id" character varying NOT NULL, "internationalTitle" character varying NOT NULL, "internationalReleaseDate" TIMESTAMP NOT NULL, "originalCountry" character varying NOT NULL, "case" character varying NOT NULL, CONSTRAINT "PK_bfd8a241854785fa9277460adeb" PRIMARY KEY ("id"))`
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
      `CREATE TABLE "movie_title_localized_information_localized_movie" ("movieTitleId" character varying NOT NULL, "localizedMovieId" character varying NOT NULL, CONSTRAINT "PK_8fb337c1964e57ab91c58e8fb06" PRIMARY KEY ("movieTitleId", "localizedMovieId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bd9047753e9943ee0d781b6100" ON "movie_title_localized_information_localized_movie" ("movieTitleId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d99dc7c9c74bdbf9cb6a06f5f" ON "movie_title_localized_information_localized_movie" ("localizedMovieId") `
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
      `ALTER TABLE "movie_title_localized_information_localized_movie" ADD CONSTRAINT "FK_bd9047753e9943ee0d781b6100c" FOREIGN KEY ("movieTitleId") REFERENCES "movie_title"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title_localized_information_localized_movie" ADD CONSTRAINT "FK_3d99dc7c9c74bdbf9cb6a06f5f4" FOREIGN KEY ("localizedMovieId") REFERENCES "localized_movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_title_localized_information_localized_movie" DROP CONSTRAINT "FK_3d99dc7c9c74bdbf9cb6a06f5f4"`
    );
    await queryRunner.query(
      `ALTER TABLE "movie_title_localized_information_localized_movie" DROP CONSTRAINT "FK_bd9047753e9943ee0d781b6100c"`
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
    await queryRunner.query(`DROP INDEX "IDX_3d99dc7c9c74bdbf9cb6a06f5f"`);
    await queryRunner.query(`DROP INDEX "IDX_bd9047753e9943ee0d781b6100"`);
    await queryRunner.query(
      `DROP TABLE "movie_title_localized_information_localized_movie"`
    );
    await queryRunner.query(`DROP INDEX "IDX_31fdec03611df037d13f2ba47d"`);
    await queryRunner.query(`DROP INDEX "IDX_5a7545667f0f249252842e6b2d"`);
    await queryRunner.query(`DROP TABLE "movie_title_tags_tag"`);
    await queryRunner.query(`DROP INDEX "IDX_748ebc15ea31377a9f2624d809"`);
    await queryRunner.query(`DROP INDEX "IDX_f265dea2bc413bac353cde3e0a"`);
    await queryRunner.query(`DROP TABLE "movie_title_companies_company"`);
    await queryRunner.query(`DROP TABLE "movie_title"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "localized_movie"`);
    await queryRunner.query(`DROP TABLE "company"`);
  }
}
