import { Redis } from "ioredis";
import { AdminApi } from "@ory/hydra-client";
import { Scarlet } from "./utils/types";
import { Span } from "opentracing";

declare module "fastify" {
  export interface FastifyRequest {
    redis: Redis;
    hydra: AdminApi;
    user: string;
    scarlet: Scarlet;
    span: Span;
  }
}
