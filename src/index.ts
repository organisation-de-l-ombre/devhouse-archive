import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest
} from "fastify";
import fastifyCors from "fastify-cors";
import { logger } from "./lib/logger";
import HealzRoute from "./routes/main/healz";

const FastifyClient: FastifyInstance = Fastify();

// Fastify plugins / instances registering
void FastifyClient.register(fastifyCors);

// Main API handlers
FastifyClient.setNotFoundHandler(
  (request: FastifyRequest, reply: FastifyReply): void => {
    void reply.code(404).send();
  }
);
FastifyClient.get("/_healz", HealzRoute);

// Data API routes

FastifyClient.listen(
  process.env.PORT || "9000",
  (error: Error, address: string): void => {
    if (error) {
      throw error;
    }

    logger.info(`Amelia started on ${address}!`);
  }
);
