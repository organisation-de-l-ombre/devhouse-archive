import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import fetch from "node-fetch";

interface RequestParameters {
  type: string;
  language: string;
  path: string;
}

export default {
  method: "GET",
  url: "/data/wiki/:type/:language/:path",
  /* schema: {
    params: {
      type: { type: "string" },
      language: { type: "string" },
      path: { type: "string" }
    }
  }, */
  handler: async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    const {
      type,
      language,
      path: requestPath
    } = request.params as RequestParameters;
    const path = requestPath.replace(/_/gi, "/");

    let baseResponse = await fetch(
      `https://s3.developershouse.xyz/international-media-referencing/amelia-data-public/wiki/${type}/${language}/${path}
    `
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
        `https://s3.developershouse.xyz/international-media-referencing/amelia-data-public/wiki/${type}/en/${path}.md`
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
} as RouteOptions;
