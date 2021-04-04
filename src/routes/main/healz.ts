import { RouteOptions } from "fastify";

export default {
  handler: (request, reply): void => {
    void reply.code(200).send();
  }
} as RouteOptions;
