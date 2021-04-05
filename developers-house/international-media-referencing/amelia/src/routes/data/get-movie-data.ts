import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { S3Client } from "../../";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default {
  method: "GET",
  url: "/data/movies/title/:movieTitle/:language",
  handler: async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    const parameters: string[] = request.url.split("/").slice(4);
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: "international-media-referencing",
      Key: `amelia-data-private/movies/title/${parameters[0]}/${parameters[1]}/${parameters[0]}.json`
    });
    const movieDataURL = await getSignedUrl(S3Client, command, {
      expiresIn: 1800
    });

    void reply.code(200).send({
      statusCode: 200,
      dataURL: movieDataURL
    });
  }
} as RouteOptions;
