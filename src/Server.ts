/*
 * Abdera the website api.
 * Just served the members for now.
 */

import Fastify, {FastifyInstance} from "fastify";
import * as IORedis from "ioredis";
import Redis, {RedisOptions} from "ioredis";
import route from "./routes/staff";

declare module "fastify" {
    export interface FastifyRequest {
        redis: IORedis.Cluster;
    }
}

const firstRedisNode: RedisOptions = {
    host: process.env["REDIS_HOST"],
    port: parseInt(process.env["REDIS_PORT"] || '6379'),
    password: process.env["REDIS_PASSWORD"],
};

export default class Server {

    private readonly server: FastifyInstance;
    private readonly redis: IORedis.Redis;

    constructor(port: number) {
        // Create the fastify server.
        this.server = Fastify({});
        // Connect to the redis cluster.
        this.redis = new Redis(firstRedisNode);
        // Add the redis connexion to all the requests objects.
        this.server.decorateRequest('redis', this.redis);

        this.server.route(route);
        this.server.get('/', (req, res) => {
            res.send({code: 'OK',});
        });
        this.server.listen({
            port,
            host: '0.0.0.0',
        })
            .then(() => console.log('Listening on :' + port));
    }
}
