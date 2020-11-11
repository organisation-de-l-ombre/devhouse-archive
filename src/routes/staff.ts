/*
 * The route to get all the staff members.
 */

import {FastifyReply, FastifyRequest, RouteOptions} from "fastify";
import {Cluster} from "ioredis";

export interface User {
    username: string;
    nickname?: string;
    presence?: {
        emote?: string;
        status: "online" | "dnd" | "offline" | "idle" | "invisible";
        presenceText?: string;
    };
    hoistRole: {
        position: number;
        color: string;
        name: string;
    };
    connexions: {
        name: string;
        link: string;
    }[];
    avatar?: string;
    discriminator: string;
    id: string;
}


const fetchUser: (id: string, redis: Cluster) => Promise<User> = async (id, redis) => {
    if (await redis.exists(`discord:cache:users:${id}`)) {
        const user: User = JSON.parse(await redis.get(`discord:cache:users:${id}`));
        return user;
    }
    throw new Error('User does not exists in cache.');
};

const route: RouteOptions = {
    method: 'GET',
    errorHandler: function (error: Error, _: FastifyRequest, reply: FastifyReply): void {
        /*
         * The error handler.
         */
        reply.code(500);
        reply.send({
            code: 500,
            message: error.message,
        });
        reply.raw.end();
    },
    async handler(req, res) {
        /*
         * Fetch all the staff team from redis.
         */
        const {redis} = req;

        if (await redis.exists('discord:cache:index')) {
            /*
             *  Fetch all the members from the cache.
             */

            const membersIds: string[] = JSON.parse(await redis.get('discord:cache:index'));
            if (Array.isArray(membersIds)) {
                const members = await Promise.all(membersIds.map((id) => fetchUser(id, redis).catch((): User => {
                    return undefined;
                }))).then(x => x.filter(x => !!x));
                res.send(members);
                return;
            }
        }
        throw new Error('Failed to fetch the user list from redis.');
    },
    url: "/staff/list",
};

export default route;
