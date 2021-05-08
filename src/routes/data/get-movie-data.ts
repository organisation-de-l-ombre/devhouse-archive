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
  // eslint-disable-next-line sonarjs/no-duplicate-string
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

    if (
      databaseRequest.length === 0 ||
      databaseRequest[0].availableLanguages.findIndex(
        (lang): boolean => lang.language === language
      ) === -1
    ) {
      void reply.code(404).send({
        statusCode: 404,
        message: `Movie not found.`
      });

      return;
    }

    const sections: string[] = [
      "headers",
      "movie",
      "casting",
      "characters",
      "videos",
      "ost",
      "technical-specs"
    ];
    const movieData: MovieData = {};

    for (const section of sections) {
      try {
        await request.S3Client().getObject({
          Bucket: process.env.S3_BUCKET_NAME || "",
          Key: `${
            process.env.S3_PRIVATE || ""
          }/movies/title/${movieTitle}/${language}/${section}.json`
        });

        const command: GetObjectCommand = new GetObjectCommand({
          Bucket: "international-media-referencing",
          Key: `${
            process.env.S3_PRIVATE || ""
          }/movies/title/${movieTitle}/${language}/${section}.json`
        });
        const dataURL = await getSignedUrl(request.S3Client(), command, {
          expiresIn: 1800
        });

        movieData[section as Section] = dataURL;
      } catch {
        continue;
      }
    }

    void reply.code(200).send({
      statusCode: 200,
      title: databaseRequest[0].name,
      data: movieData
    });
  }
} as RouteOptions;
