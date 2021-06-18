import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MovieTitle } from "@entities/movie-title";

interface RequestParameters {
  movieTitle: string;
  language: string;
}

interface MovieData {
  headers?: string;
  movie?: string;
  casting?: string;
  characters?: string;
  ost?: string;
  "technical-specs"?: string;
}

type Section =
  | "headers"
  | "movie"
  | "casting"
  | "characters"
  | "ost"
  | "technical-specs";

export default {
  method: "GET",
  url: "/data/movies/title/:movieTitle/:language",
  schema: {
    params: {
      movieTitle: { type: "string" },
      language: { type: "string" }
    }
  },
  async handler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { movieTitle, language } = request.params as RequestParameters;
    const repository = request.databaseConnection().getRepository(MovieTitle);
    const databaseRequest: MovieTitle[] = await repository.find({
      where: {
        id: movieTitle
      },
      relations: ["availableLanguages"]
    });
    const databaseResult: MovieTitle = databaseRequest[0];

    if (
      databaseRequest.length === 0 ||
      databaseResult.availableLanguages.findIndex(
        (lang): boolean => lang.language === language
      ) === -1
    ) {
      void reply.code(404).send({
        statusCode: 404,
        message: `Movie not found.`
      });

      return;
    }

    const files = await request.internalS3Client().listObjects({
      Bucket: process.env.S3_BUCKET_NAME || "",
      Prefix: `${
        process.env.S3_PRIVATE || ""
      }/movies/title/${movieTitle}/${language}`
    });

    if (!files.Contents || (files.Contents && files.Contents.length === 0)) {
      void reply.code(404).send({
        statusCode: 404,
        message: `Movie not found.`
      });

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
      headers: "1",
      movie: "2",
      casting: "3",
      characters: "4",
      videos: "5",
      ost: "6",
      "technical-specs": "7"
    };

    for (const section of sections) {
      const command: GetObjectCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME || "",
        Key: `${
          process.env.S3_PRIVATE || ""
        }/movies/title/${movieTitle}/${language}/${
          // eslint-disable-next-line security/detect-object-injection
          indexes[section]
        }_${section}.json`
      });
      const dataURL = await getSignedUrl(request.externalS3Client(), command, {
        expiresIn: 1800
      });

      Object.assign(movieData, { [section]: dataURL });
    }

    void reply.code(200).send({
      statusCode: 200,
      body: {
        id: databaseResult.id,
        title: databaseResult.name,
        data: movieData
      }
    });
  }
} as RouteOptions;
