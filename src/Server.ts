/*
 * Abdera the website api.
 * Just served the members for now.
 */

import { AdminApi } from '@oryd/hydra-client';
import Fastify, {FastifyInstance} from "fastify";
import * as IORedis from "ioredis";
import {Cluster, RedisOptions} from "ioredis";
import { AdminAPI } from './hydra';
import route from "./routes/staff";
import user from './routes/user';

declare module "fastify" {
    export interface FastifyRequest {
        redis: IORedis.Cluster;
        hydra: AdminApi;
    }
}

const firstRedisNode: RedisOptions = {
	port: parseInt(process.env["REDIS_PORT"] || "6379"),
	password: process.env["REDIS_PASSWORD"],
};

export default class Server {

    private readonly server: FastifyInstance;
    private readonly redis: Cluster;

    private readonly hydra: AdminApi;

    constructor(port: number) {
        // Create the fastify server.
        this.server = Fastify({});
        // Connect to the redis cluster.
        this.redis = new Cluster([{
			...firstRedisNode,
			host: process.env["REDIS_HOST"] || 'localhost',
		}], { redisOptions: {
			password: process.env["REDIS_PASSWORD"],
        } });
        
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
