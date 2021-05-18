declare module "fastify" {
  export interface FastifyRequest {
    S3Client: () => S3ClientBuilder;
    databaseConnection: () => Connection;
  }
}

import "reflect-metadata";
import * as Sentry from "@sentry/node";
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
import dotenv from "dotenv";

dotenv.config();

addAliases({
  "@entities": path.join(__dirname, "entity"),
  "@migrations": path.join(__dirname, "migrations")
});

import { Company } from "@entities/company";
import { Language } from "@entities/language";
import { MovieTitle } from "@entities/movie-title";
import { Tag } from "@entities/tag";
import { MovieTitle1618162709488 } from "./migration/1618162709488-MovieTitle";

const databaseHost: string = process.env.POSTGRES_HOST || "";
const databaseUsername: string = process.env.POSTGRES_USERNAME || "";

Sentry.init({
  dsn:
    "https://91ed16cf487540ec98f941f9f5d03d82@o683578.ingest.sentry.io/5771237"
});

createConnection({
  type: "postgres",
  host: databaseHost,
  port: Number.parseInt(process.env.POSTGRES_PORT || ""),
  database: process.env.POSTGRES_DATABASE || "",
  username: databaseUsername,
  password: process.env.POSTGRES_PASSWORD || "",
  entities: [Company, Language, MovieTitle, Tag],
  migrations: [MovieTitle1618162709488]
})
  .then(
    async (connection: Connection): Promise<boolean> => {
      await connection.synchronize(false);

      logger.info(
        `Postgres database connection ${databaseUsername}@${databaseHost} successful.`
      );

      new (class AmeliaAPI {
        FastifyClient: FastifyInstance = Fastify();
        S3Client: S3ClientBuilder = new S3ClientBuilder({
          endpoint: "https://s3.developershouse.xyz",
          region: "eu",
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY || "",
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ""
          },
          forcePathStyle: true
        });
        routes: RouteOptions[] = [];

        constructor() {
          this.addPlugins();
          this.addDecorators();
          void this.setupRouting();
          this.start();
        }

        // Adds plugins to Fastify instance
        addPlugins(): void {
          void this.FastifyClient.register(fastifyCors);
          this.FastifyClient.addHook(
            "onError",
            (_request, _reply, error, done) => {
              if (process.env.NODE_ENV !== "development") {
                Sentry.captureException(error);
              }
              // eslint-disable-next-line promise/no-callback-in-promise
              done();
            }
          );
        }

        // Adds decorations to Fastify instance
        addDecorators(): void {
          this.FastifyClient.decorateRequest(
            "S3Client",
            (): S3ClientBuilder => this.S3Client
          );
          this.FastifyClient.decorateRequest(
            "databaseConnection",
            (): Connection => connection
          );
        }

        // Setup Amelia API routing
        async setupRouting(): Promise<void> {
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
  .catch(console.error);
