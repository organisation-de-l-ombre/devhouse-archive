import { FastifyInstance, RouteOptions } from "fastify";
import { logoutAll } from "../../logic/hydra-interface";
import { hydraCheckToken } from "../../middlewares/hydra-check-token";

const postLogoutAll = (server: FastifyInstance): RouteOptions => {
    return {
        method: "POST",
        async handler(
            req,
            res
        ) {
            const user = req.user;
            res.send(await logoutAll(user, req.hydra));
        },
        url: "/self/logoutAll",
        preHandler: server.auth([
            hydraCheckToken(["account.authorized.edit"])
        ] , {})
    };
}

export default postLogoutAll;
