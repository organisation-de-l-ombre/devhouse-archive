import { FastifyReply, FastifyRequest } from "fastify";
import { MovieTitle } from "@entities/movie-title";
import { Language } from "@entities/localized-movie";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

export class MoviesProvider {
  request: FastifyRequest;
  reply: FastifyReply;

  constructor(request: FastifyRequest, reply: FastifyReply) {
    this.request = request;
    this.reply = reply;
  }

  async getMovieData(id: string, language: string): Promise<void> {
    const repository = this.request
      .databaseConnection()
      .getRepository(MovieTitle);
    const databaseRequest: MovieTitle[] = await repository.find({
      where: {
        id
      },
      relations: ["availableLanguages"]
    });
    const databaseResult: MovieTitle = databaseRequest[0];

    if (
      databaseRequest.length === 0 ||
      databaseResult.availableLanguages.findIndex(
        (lang: Language): boolean => lang.language === language
      ) === -1
    ) {
      void this.reply.code(404).send({
        sttusCode: 404,
        message: "Movie not found."
      });

      return;
    }

    const files = await this.request.internalS3Client().listObjects({
      Bucket: process.env.S3_BUCKET_NAME || "",
      Prefix: `${process.env.S3_PRIVATE || ""}/movies/title/${id}/${language}`
    });

    if (!files.Contents || (files.Contents && files.Contents.length === 0)) {
      void this.reply.code(404).send({
        sttusCode: 404,
        message: "Movie not found."
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
        Key: `${process.env.S3_PRIVATE || ""}/movies/title/${id}/${language}/${
          indexes[section as keyof typeof indexes]
        }_${section}.json`
      });
      const dataURL = await getSignedUrl(
        this.request.externalS3Client(),
        command,
        {
          expiresIn: 1800
        }
      );

      Object.assign(movieData, { [section]: dataURL });
    }

    void this.reply.send({
      statusCode: 200,
      data: {
        id: databaseResult.id,
        title: databaseResult.name,
        links: movieData
      }
    });
  }
}
