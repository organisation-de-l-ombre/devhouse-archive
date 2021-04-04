import Fastify, { FastifyInstance } from "fastify";
import fastifyCors from "fastify-cors";
import { logger } from "./lib/logger";
import HealzRoute from "./routes/main/healz";

const FastifyClient: FastifyInstance = Fastify();

void FastifyClient.register(fastifyCors);
FastifyClient.setNotFoundHandler((request, reply): void => {
  void reply.code(404).send();
});

FastifyClient.get("/_healz", HealzRoute);

FastifyClient.listen("9000", (error: Error, address: string): void => {
  if (error) {
    throw error;
  }

  logger.info(`Amelia started on ${address}!`);
});
