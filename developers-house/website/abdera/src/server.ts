import { AdminApi } from '@oryd/hydra-client';
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import CreateRedis, { Redis } from "ioredis";
import { AdminAPI } from './hydra';
import fastifyAuth from "fastify-auth";
import getProjects from "./logic/get-projects";
import {getProjectsRoute} from "./routes/data/get-projects";
import {getStaffRoute} from "./routes/data/get-staff";
import getAuthorizationsRoute from "./routes/user/get-authorizations";
import deleteAuthorizationRoute from "./routes/user/delete-authorizations";
import getTakeouts from "./routes/user/get-takeouts";
import postLogoutAll from "./routes/user/post-logoutAll";
import postTakeouts from "./routes/user/post-takeouts";

declare module "fastify" {
    export interface FastifyRequest {
        redis: Redis;
        hydra: AdminApi;
        user: string;
    }
}

export default class Server {
    private readonly server: FastifyInstance;
    private readonly redis: Redis;

    private readonly hydra: AdminApi;

    constructor(port: number) {
        // Create the fastify server.
        this.server = Fastify({});
        // Connect to the redis cluster.
        this.redis = new CreateRedis({
            sentinels: [
                {
                    host: process.env["REDIS_HOST"],
                    port: parseInt(process.env["REDIS_PORT"] || "6379"),
                },
            ],
            sentinelPassword: process.env["REDIS_PASSWORD"],
            name: "mymaster",
        });
        this.redis.on('error', () => {});

        this.hydra = AdminAPI;
        // Add the redis connexion to all the requests objects.
        this.server.decorateRequest('redis', this.redis);
        this.server.decorateRequest('hydra', this.hydra);

        this.server.decorate("verifyHydraToken", function (request, reply, done) {

        });

        this.server.register(fastifyAuth).after(() => {
            this.server.route(getProjectsRoute);
            this.server.route(getStaffRoute);
            this.server.route(getAuthorizationsRoute(this.server));
            this.server.route(deleteAuthorizationRoute(this.server));
            this.server.route(getTakeouts(this.server));
            this.server.route(postLogoutAll(this.server));
            this.server.route(postTakeouts(this.server));

            this.server.setErrorHandler(Server.errorHandler);
            this.server.setNotFoundHandler(Server.notFound);
        });

        this.server.listen({
            port,
            host: '0.0.0.0',
        });
    }

    private static errorHandler(error, req: FastifyRequest, res: FastifyReply) {
        res.code(500);
        res.send();
    }

    private static notFound(req: FastifyRequest, res: FastifyReply) {
        res.code(404);
        res.send();
    }
}
