import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import Fastify, {
  RouteOptions,
  FastifyInstance,
  FastifyRequest,
  FastifyReply
} from "fastify";
import { S3 as S3ClientBuilder } from "@aws-sdk/client-s3";
import fastifyCors from "fastify-cors";
import { logger } from "./lib/logger";
import { readdirSync } from "fs";
import path from "path";
import { addAliases } from "module-alias";

addAliases({
  "@entities": path.join(__dirname, "entity")
});

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
let databaseConnection: Connection;

createConnection({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "192.168.1.80",
  port: Number.parseInt(process.env.POSTGRES_PORT || "5432"),
  database: process.env.POSTGRES_DATABASE || "test",
  username: process.env.POSTGRES_USERNAME || "test",
  password: process.env.POSTGRES_PASSWORD || "test"
})
  .then(
    async (connection: Connection): Promise<boolean> => {
      await connection.synchronize(false);

      databaseConnection = connection;

      new (class AmeliaAPI {
        FastifyClient: FastifyInstance = Fastify();
        routes: RouteOptions[] = [];

        constructor() {
          this.addPlugins();
          void this.setupRouting();
          this.start();
        }

        // Adds plugins to Fastify instance
        addPlugins(): void {
          void this.FastifyClient.register(fastifyCors);
        }

        // Setup Amelia API routing
        async setupRouting(): Promise<void> {
          this.FastifyClient.setNotFoundHandler(
            (request: FastifyRequest, reply: FastifyReply): void => {
              void reply.code(404).send();
            }
          );

          const directories: string[] = readdirSync(
            path.join(__dirname, "routes")
          );

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

          this.FastifyClient.setErrorHandler(
            (
              error: Error,
              request: FastifyRequest,
              reply: FastifyReply
            ): void => {
              logger.error(
                `API error at URL ${request.url} :\n${error.message}`
              );
              void reply.code(500).send({
                statusCode: 500,
                error
              });
            }
          );

          this.FastifyClient.setNotFoundHandler(
            (request: FastifyRequest, reply: FastifyReply): void => {
              void reply.code(404).send();
            }
          );

          logger.info(
            `Amelia is starting with ${this.routes.length} routes...`
          );
        }

        // Starts Amelia
        start(): void {
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

      return true;
    }
  )
  .catch((error) => console.log(error));

export { S3Client, databaseConnection };
