import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import fetch from "node-fetch";
import { internalS3ClientEndpoint } from "../../server";

interface RequestParameters {
  type: string;
  language: string;
  path: string;
}

const getWiki: RouteOptions = {
  method: "GET",
  url: "/data/wiki/:type/:language/:path",
  /* schema: {
    params: {
      type: { type: "string" },
      language: { type: "string" },
      path: { type: "string" }
    }
  }, */
  async handler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const {
      type,
      language,
      path: requestPath
    } = request.params as RequestParameters;
    const path = requestPath.replace(/_/gi, "/");

    let baseResponse = await fetch(
      `${internalS3ClientEndpoint}/${process.env.S3_BUCKET_NAME || ""}/${
        process.env.S3_PUBLIC || ""
      }/wiki/${type}/${language}/${path}.md`
    );

    if (language === "en" && baseResponse.status === 404) {
      void reply.code(404).send({
        statusCode: 404,
        message: "Wiki not found."
      });

      return;
    }
    if (language !== "en" && baseResponse.status === 404) {
      baseResponse = await fetch(
        `${internalS3ClientEndpoint}/${process.env.S3_BUCKET_NAME || ""}/${
          process.env.S3_PUBLIC || ""
        }/wiki/${type}/en/${path}.md`
      );

      if (baseResponse.status === 404) {
        void reply.code(404).send({
          statusCode: 404,
          message: "Wiki not found."
        });

        return;
      }
    }

    const response = await baseResponse.text();

    void reply.code(200).send({
      statusCode: 200,
      body: response
    });
  }
};

export default getWiki;
