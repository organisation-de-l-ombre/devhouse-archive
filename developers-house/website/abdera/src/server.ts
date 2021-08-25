import { AdminApi } from "@ory/hydra-client";
import fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply
} from "fastify";
import { Redis } from "ioredis";
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
import fastifyCors from "fastify-cors";
import { Scarlet } from "./utils/types";
import { redisBuild } from "./utils/redis";
import { Tracer } from "./jaeger";
import { FORMAT_HTTP_HEADERS } from "opentracing";

// TODO: Dynamic domain names.
const scarlet = "http://production.scarlet-22198115-production";

export default class Server {
  private readonly server: FastifyInstance = fastify();
  private readonly redis: Redis = redisBuild();
  private readonly hydra: AdminApi = AdminAPI;
  private readonly scarlet: Scarlet = {
    user: new UserApi(undefined, scarlet),
    webAuth: new WebauthApi(undefined, scarlet),
    login: new LoginApi(undefined, scarlet),
    links: new LinksApi(undefined, scarlet)
  };

  constructor(port: number) {
    this.server.addHook("onRequest", (request, _response, next) => {
      request.redis = this.redis;
      request.hydra = this.hydra;
      request.scarlet = this.scarlet;
      const remoteSpan = Tracer.extract(FORMAT_HTTP_HEADERS, request.headers);
      request.span = Tracer.startSpan("request_start", {
        childOf: remoteSpan || undefined
      });
      next();
    });

    this.server.addHook("onSend", (request, _response, _payload, next) => {
      request.span.finish();
      next();
    });

    void this.server.register(fastifyCors, {});

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

      this.server.setErrorHandler(Server.errorHandler);
      this.server.setNotFoundHandler(Server.notFound);
    });

    void this.server
      .listen({
        port,
        host: "0.0.0.0"
      })
      .then(() => console.log("Server started."));
  }

  private static errorHandler(
    this: void,
    error: unknown,
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
