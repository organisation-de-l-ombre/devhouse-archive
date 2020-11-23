/*
 * Abdera the website api.
 * Just served the members for now.
 */

import {AdminApi} from '@oryd/hydra-client';
import Fastify, {FastifyInstance} from "fastify";
import CreateRedis, {Redis} from "ioredis";
import {AdminAPI} from './hydra';
import route from "./routes/staff";
import user from './routes/user';

declare module "fastify" {
    export interface FastifyRequest {
        redis: Redis;
        hydra: AdminApi;
    }
}

const firstRedisNode: { host: string; port: number } = {
    host: '',
    port: parseInt(process.env["REDIS_PORT"] || "6379"),
};

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
                firstRedisNode,
            ],
            sentinelPassword: process.env["REDIS_PASSWORD"],
            name: "redisfailover-persistent",
        });

        this.hydra = AdminAPI;
        // Add the redis connexion to all the requests objects.
        this.server.decorateRequest('redis', this.redis);
        this.server.decorateRequest('hydra', this.hydra);


        this.server.route(route);
        this.server.route(user);

        this.server.get('/', (_, res) => {
            res.send({code: 'OK',});
        });
        this.server.listen({
            port,
            host: '0.0.0.0',
        })
            .then(() => console.log('Listening on :' + port));
    }
}
