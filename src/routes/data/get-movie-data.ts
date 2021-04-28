import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MovieTitle } from "@entities/movie-title";

interface RequestParameters {
  movieTitle: string;
  language: string;
}

export default {
  method: "GET",
  url: "/data/movies/title/:movieTitle/:language",
  schema: {
    params: {
      movieTitle: { type: "string" },
      language: { type: "string" }
    }
  },
  handler: async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
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

    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: "international-media-referencing",
      Key: `amelia-data-private/movies/title/${movieTitle}/${language}/${movieTitle}.json`
    });
    const movieDataURL = await getSignedUrl(request.S3Client(), command, {
      expiresIn: 1800
    });

    void reply.code(200).send({
      statusCode: 200,
      dataURL: movieDataURL
    });
  }
} as RouteOptions;
