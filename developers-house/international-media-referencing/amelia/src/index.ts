import Fastify, { RouteOptions, FastifyInstance } from "fastify";
import { S3 as S3ClientBuilder } from "@aws-sdk/client-s3";
import fastifyCors from "fastify-cors";
import { logger } from "./lib/logger";
import { readdirSync } from "fs";
import path from "path";

const S3Client: S3ClientBuilder = new S3ClientBuilder({
  endpoint: "https://s3.developershouse.xyz",
  region: "eu",
  credentials: {
    accessKeyId:
      process.env.S3_ACCESS_KEY || "9fd286dc-1cfb-47e9-a34f-f8786979b1dd",
    secretAccessKey:
      process.env.S3_SECRET_ACCESS_KEY || "fb065cb4-4bc7-44c4-991d-465d674b41a0"
  },
  forcePathStyle: true
});

new (class AmeliaAPI {
  FastifyClient: FastifyInstance = Fastify();
  routes: RouteOptions[] = [];

  constructor() {
    this.addPlugins();
    this.addDecorators();
    void this.setupRouting();
    this.startAmelia();
  }

  // Adds plugins to Fastify instance
  addPlugins(): void {
    void this.FastifyClient.register(fastifyCors);
  }

  // Adds decorators to Fastify instance
  addDecorators(): void {
    this.FastifyClient.decorateReply(
      "S3Client",
      (): S3ClientBuilder => S3Client
    );
  }

  // Setup Amelia API routing
  async setupRouting(): Promise<void> {
    /* this.FastifyClient.setNotFoundHandler(
      (request: FastifyRequest, reply: FastifyReply): void => {
        void reply.code(404).send();
      }
    ); */

    const directories: string[] = readdirSync(path.join(__dirname, "routes"));

    for (const directory of directories) {
      const routes: string[] = readdirSync(
        path.join(__dirname, "routes", directory)
      );

      for (const route of routes) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { default: routeFile } = await import(
          `${path.join(__dirname, "routes", directory, route)}`
        );

        this.routes.push(routeFile);
      }
    }

    for (const route of this.routes) {
      this.FastifyClient.route(route);
    }

    logger.info(`Amelia is starting with ${this.routes.length} routes...`);
  }

  // Starts Amelia
  startAmelia(): void {
    this.FastifyClient.listen(
      process.env.PORT || "9000",
      (error: Error, address: string): void => {
        if (error) {
          throw error;
        }

        logger.info(`Amelia started and listening on ${address}.`);
      }
    );
  }
})();

export { S3Client };
