import { AdminApi } from "@oryd/hydra-client";
import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest
} from "fastify";
import CreateRedis, { Redis } from "ioredis";
import { AdminAPI } from "./hydra";
import {
  UserApi,
  WebauthApi,
  LoginApi,
  LinksApi
} from "@developers-house/scarlet";
import fastifyAuth from "fastify-auth";
import { getProjectsRoute } from "./routes/data/get-projects";
import { getStaffRoute } from "./routes/data/get-staff";
import getAuthorizationsRoute from "./routes/user/get-authorizations";
import deleteAuthorizationRoute from "./routes/user/delete-authorizations";
import getTakeouts from "./routes/user/get-takeouts";
import postLogoutAll from "./routes/user/post-logout-all";
import postTakeouts from "./routes/user/post-takeouts";
import getLinksRoute from "./routes/user/get-links";
import getSelfRoute from "./routes/user/get-self";
import { getFeatureFlags } from "./routes/data/get-feature-gates";

interface Scarlet {
  user: UserApi;
  webAuth: WebauthApi;
  login: LoginApi;
  links: LinksApi;
}

declare module "fastify" {
  export interface FastifyRequest {
    redis: Redis;
    hydra: AdminApi;
    user: string;
    scarlet: Scarlet;
  }
}

const scarlet =
  "http://developers-house-dev-login-group-scarlet.scarlet-22198115-production";

export default class Server {
  private readonly server: FastifyInstance = Fastify();
  private readonly redis: Redis = new CreateRedis({
    sentinels: [
      {
        host: process.env.REDIS_HOST,
        port: Number.parseInt(process.env.REDIS_PORT || "6379")
      }
    ],
    sentinelPassword: process.env.REDIS_PASSWORD,
    name: "mymaster",
    host: "localhost"
  });
  private readonly hydra: AdminApi = AdminAPI;
  private readonly scarlet: Scarlet = {
    user: new UserApi(undefined, scarlet),
    webAuth: new WebauthApi(undefined, scarlet),
    login: new LoginApi(undefined, scarlet),
    links: new LinksApi(undefined, scarlet)
  };

  constructor(port: number) {
    this.server.decorateRequest("redis", this.redis);
    this.server.decorateRequest("hydra", this.hydra);
    this.server.decorateRequest("scarlet", this.scarlet);

    this.server.register(fastifyAuth).after(() => {
      this.server.route(getProjectsRoute);
      this.server.route(getStaffRoute);
      this.server.route(getAuthorizationsRoute(this.server));
      this.server.route(deleteAuthorizationRoute(this.server));
      this.server.route(getTakeouts(this.server));
      this.server.route(postLogoutAll(this.server));
      this.server.route(postTakeouts(this.server));
      this.server.route(getLinksRoute(this.server));
      this.server.route(getSelfRoute(this.server));
      this.server.route(getFeatureFlags);

      this.server.setErrorHandler(Server.errorHandler);
      this.server.setNotFoundHandler(Server.notFound);
    });

    void this.server.listen({
      port,
      host: "0.0.0.0"
    });
  }

  private static errorHandler(
    this: void,
    error,
    _request: FastifyRequest,
    response: FastifyReply
  ) {
    void response.code(500);
    console.error(error);
    void response.send(error);
  }

  private static notFound(
    this: void,
    _request: FastifyRequest,
    response: FastifyReply
  ) {
    void response.code(404);
    void response.send();
  }
}
