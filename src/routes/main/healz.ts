import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";

export default {
  method: "GET",
  url: "/_healz",
  handler: (request: FastifyRequest, reply: FastifyReply): void => {
    void reply.code(200).send();
  }
} as RouteOptions;
