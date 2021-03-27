import { FastifyInstance, RouteOptions } from "fastify";
import { getAuthorizations } from "../../logic/hydra-interface";
import { hydraCheckToken } from "../../middlewares/hydra-check-token";

const getAuthorizationsRoute = (server: FastifyInstance): RouteOptions => {
    return {
        method: "GET",
        async handler(
            req,
            res
        ) {
            const user = req.user;
            res.send(await getAuthorizations(user, req.hydra));
        },
        url: "/self/authorizations",
        preHandler: server.auth([
            hydraCheckToken(["account.authorized.read"])
        ] , {})
    };
};

export default getAuthorizationsRoute;
