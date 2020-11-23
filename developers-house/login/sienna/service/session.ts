import { expressSession } from 'next-session';
import connect from 'connect-redis';
import CreateRedis from 'ioredis';
import { Options } from 'next-session/dist/types';

const RedisStore = connect(expressSession);
const firstRedisNode: { host: string; port: number } = {
    host: process.env["REDIS_HOST"] || 'localhost',
    port: parseInt(process.env["REDIS_PORT"] || "6379"),
};

const client = new CreateRedis({
    sentinels: [
        firstRedisNode,
    ],
    sentinelPassword: process.env["REDIS_PASSWORD"],
    name: "mymaster",
});

export const options: Options = {
    store: new RedisStore({ client }),
};