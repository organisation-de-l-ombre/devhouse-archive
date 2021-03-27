import { FastifyInstance, RouteOptions } from "fastify";
import { postUserTakeout } from "../../logic/cryir-interface";
import { hydraCheckToken } from "../../middlewares/hydra-check-token";

const postTakeouts = (server: FastifyInstance): RouteOptions => {
    return {
        method: "POST",
        async handler(
            req,
            res
        ) {
            const user = req.user;
            res.send(await postUserTakeout(user));
        },
        url: "/self/takeouts",
        preHandler: server.auth([
            hydraCheckToken(["account.takeouts.create"])
        ] , {})
    };
}

export default postTakeouts;
