import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { GetObjectCommand, ListObjectsCommandOutput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MovieTitle } from "@entities/movie-title";
import { LocalizedMovie } from "@entities/localized-movie";
import { Tag } from "@entities/tag";
import { Company } from "@entities/company";

interface RequestParameters {
  movieId: string;
  language: string;
}

type Section =
  | "headers"
  | "movie"
  | "casting"
  | "characters"
  | "videos"
  | "ost"
  | "technical-specs";

type MovieData = {
  [key in Section]?: string;
};

export default {
  method: "GET",
  url: "/data/movies/title/:movieId/:language",
  schema: {
    params: {
      movieId: { type: "string" },
      language: { type: "string" }
    }
  },
  async handler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { movieId, language } = request.params as RequestParameters;
    const repository = request.databaseConnection().getRepository(MovieTitle);
    const databaseRequest: MovieTitle[] = await repository.find({
      where: {
        id: movieId
      },
      relations: ["companies", "tags", "localizedInformation"]
    });
    const databaseResult: MovieTitle = databaseRequest[0];

    if (
      databaseRequest.length === 0 ||
      !databaseResult.localizedInformation.some(
        (localizedMovie: LocalizedMovie): boolean =>
          localizedMovie.language === language
      )
    ) {
      void reply.code(404).send();

      return;
    }

    const files: ListObjectsCommandOutput = await request
      .internalS3Client()
      .listObjects({
        Bucket: process.env.S3_BUCKET_NAME || "",
        Prefix: `${
          process.env.S3_PRIVATE || ""
        }/movies/title/${movieId}/${language}`
      });

    if (!files.Contents || (files.Contents && files.Contents.length === 0)) {
      void reply.code(404).send();

      return;
    }

    const sections: Section[] = [];

    for (const file of files.Contents) {
      const key = file.Key?.split("/");

      if (!key) {
        continue;
      }

      const name = key[key.length - 1].slice(2, -5);

      if (name.length === 0) {
        continue;
      }

      sections.push(name as Section);
    }

    const movieData: MovieData = {};
    const indexes = {
      headers: 1,
      movie: 2,
      casting: 3,
      characters: 4,
      videos: 5,
      ost: 6,
      "technical-specs": 7
    };

    for (const section of sections) {
      const command: GetObjectCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME || "",
        Key: `${
          process.env.S3_PRIVATE || ""
        }/movies/title/${movieId}/${language}/${
          indexes[section as keyof typeof indexes]
        }_${section}.json`
      });
      const dataURL = await getSignedUrl(request.externalS3Client(), command, {
        expiresIn: 1800
      });

      Object.assign(movieData, { [section]: dataURL });
    }

    const localizedMovie = databaseResult.localizedInformation.find(
      (localizedMovie: LocalizedMovie): boolean =>
        localizedMovie.language === language
    ) as LocalizedMovie;

    void reply.code(200).send({
      ...databaseResult,
      companies: databaseResult.companies.map(
        (company: Company): string => company.name
      ),
      tags: databaseResult.tags.map((tag: Tag): string => tag.name),
      case: databaseResult.case,
      localizedInformation: {
        ...localizedMovie,
        id: undefined
      },
      data: movieData
    });
  }
} as RouteOptions;
