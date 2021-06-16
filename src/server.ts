declare module "fastify" {
  export interface FastifyRequest {
    internalS3Client: () => S3ClientBuilder;
    externalS3Client: () => S3ClientBuilder;
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
  "@typings": path.join(__dirname, "typings"),
  "@providers": path.join(__dirname, "providers")
});

import { Company } from "@entities/company";
import { Language } from "@entities/localized-movie";
import { MovieTitle } from "@entities/movie-title";
import { Tag } from "@entities/tag";
import { MovieTitle1618162709488 } from "./migration/1618162709488-MovieTitle";

Sentry.init({
  dsn:
    "https://91ed16cf487540ec98f941f9f5d03d82@o683578.ingest.sentry.io/5771237"
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

export const internalS3ClientEndpoint: string =
  process.env.NODE_ENV === "development"
    ? "https://s3.developershouse.xyz"
    : "https://minio.minio";

new (class Amelia {
  FastifyClient: FastifyInstance = Fastify();
  databaseConnection!: Connection;
  internalS3Client: S3ClientBuilder = new S3ClientBuilder({
    endpoint: internalS3ClientEndpoint,
    region: "eu",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ""
    },
    forcePathStyle: true
  });
  externalS3Client: S3ClientBuilder = new S3ClientBuilder({
    endpoint: "https://cdn.developershouse.xyz",
    region: "eu",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ""
    },
    forcePathStyle: true
  });
  routes: RouteOptions[] = [];

  constructor() {
    void this.launch();
  }

  private async launch(): Promise<void> {
    await this.initializeDatabase();
    this.addPlugins();
    this.addDecorators();
    void this.handleRouting();
    this.listen();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      this.databaseConnection = await createConnection({
        type: "postgres",
        host: process.env.POSTGRES_HOST || "",
        port: Number.parseInt(process.env.POSTGRES_PORT || ""),
        database: process.env.POSTGRES_DATABASE || "",
        username: process.env.POSTGRES_USERNAME || "",
        password: process.env.POSTGRES_PASSWORD || "",
        entities: [Company, Language, MovieTitle, Tag],
        migrations: [MovieTitle1618162709488]
      });

      logger.info("Connected to the Postgres database.");
    } catch (error) {
      throw new Error(error);
    }
  }

  // Adds plugins to Fastify instance
  private addPlugins(): void {
    void this.FastifyClient.register(fastifyCors);
    this.FastifyClient.addHook("onError", (_request, _reply, error, done) => {
      if (process.env.NODE_ENV !== "development") {
        Sentry.captureException(error);
      }
      // eslint-disable-next-line promise/no-callback-in-promise
      done();
    });
  }

  // Adds decorations to Fastify instance
  private addDecorators(): void {
    this.FastifyClient.decorateRequest(
      "internalS3Client",
      (): S3ClientBuilder => this.internalS3Client
    );
    this.FastifyClient.decorateRequest(
      "externalS3Client",
      (): S3ClientBuilder => this.externalS3Client
    );
    this.FastifyClient.decorateRequest(
      "databaseConnection",
      (): Connection => this.databaseConnection
    );
  }

  // Setup Amelia API routing
  private async handleRouting(): Promise<void> {
    this.FastifyClient.setErrorHandler(
      (error: Error, request: FastifyRequest, reply: FastifyReply): void => {
        logger.error(`API error at URL ${request.url} :\n${error.message}`);
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

  // Starts Amelia on the provided port
  private listen(): void {
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
