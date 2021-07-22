declare module "fastify" {
  export interface FastifyRequest {
    internalS3Client: () => S3;
    externalS3Client: () => S3;
    databaseConnection: () => Connection;
  }
}

import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import Fastify, {
  RouteOptions,
  FastifyInstance,
  FastifyRequest,
  FastifyReply
} from "fastify";
import { S3 } from "@aws-sdk/client-s3";
import fastifyCors from "fastify-cors";
import { readdirSync } from "fs";
import path from "path";
import { addAliases } from "module-alias";
import dotenv from "dotenv";

dotenv.config();

addAliases({
  "@entities": path.join(__dirname, "entity")
});

interface RouteFile {
  default: RouteOptions;
}

export const internalS3ClientEndpoint =
  "http://vmi379623.contaboserver.net:6860";

new (class Amelia {
  FastifyClient: FastifyInstance = Fastify({
    logger: process.env.NODE_ENV === "production"
  });
  databaseConnection!: Connection;
  internalS3Client: S3 = new S3({
    endpoint: internalS3ClientEndpoint,
    region: "us-west-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    forcePathStyle: true
  });
  externalS3Client: S3 = new S3({
    endpoint: "https://cdn.developershouse.xyz",
    region: "us-west-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
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
        host: process.env.POSTGRES_HOST,
        port: Number.parseInt(process.env.POSTGRES_PORT),
        database: process.env.POSTGRES_DATABASE,
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        entities: ["dist/src/entity/**/*.js"],
        migrations: ["dist/src/migration/**/*.js"],
        synchronize: true
      });

      console.info("Connected to the Postgres database.");
    } catch (error) {
      throw new Error(error);
    }
  }

  private addPlugins(): void {
    void this.FastifyClient.register(fastifyCors);
  }

  private addDecorators(): void {
    this.FastifyClient.decorateRequest(
      "internalS3Client",
      (): S3 => this.internalS3Client
    );
    this.FastifyClient.decorateRequest(
      "externalS3Client",
      (): S3 => this.externalS3Client
    );
    this.FastifyClient.decorateRequest(
      "databaseConnection",
      (): Connection => this.databaseConnection
    );
  }

  private async handleRouting(): Promise<void> {
    this.FastifyClient.setErrorHandler(
      (error: Error, _request: FastifyRequest, reply: FastifyReply): void => {
        console.error(error);

        void reply.code(500).send();
      }
    );

    this.FastifyClient.setNotFoundHandler(
      (_request: FastifyRequest, reply: FastifyReply): void => {
        void reply.code(404).send();
      }
    );

    const directories: string[] = readdirSync(path.join(__dirname, "routes"));

    for (const directory of directories) {
      const routes: string[] = readdirSync(
        path.join(__dirname, "routes", directory)
      );

      for (const route of routes) {
        const { default: routeFile } = (await import(
          `${path.join(__dirname, "routes", directory, route)}`
        )) as RouteFile;

        this.routes.push(routeFile);
      }
    }

    for (const route of this.routes) {
      this.FastifyClient.route(route);
    }

    console.info(`Amelia is starting with ${this.routes.length} routes...`);
  }

  private listen(): void {
    this.FastifyClient.listen(
      9000,
      "0.0.0.0",
      (error: Error, address: string): void => {
        if (error) {
          throw error;
        }

        console.info(`Amelia started and listening on ${address}.`);
      }
    );
  }
})();
