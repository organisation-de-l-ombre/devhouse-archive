import { FastifyInstance, RouteOptions } from "fastify";
import { getUserTakeouts } from "../../logic/cryir-interface";
import { hydraCheckToken } from "../../middlewares/hydra-check-token";

const getTakeouts = (server: FastifyInstance): RouteOptions => {
    return  {
        method: "GET",
        async handler(
            req,
            res
        ) {
            const user = req.user;
            res.send(await getUserTakeouts(user));
        },
        url: "/self/takeouts",
        preHandler: server.auth([
            hydraCheckToken(["account.takeouts.list"])
        ] , {})
    };
}

export default getTakeouts;
