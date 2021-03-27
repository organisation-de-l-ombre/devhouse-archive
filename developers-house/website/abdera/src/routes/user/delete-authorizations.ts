import {FastifyInstance, RouteOptions} from "fastify";
import { deleteAuthorization } from "../../logic/hydra-interface";
import { hydraCheckToken } from "../../middlewares/hydra-check-token";

const deleteAuthorizationRoute = (server: FastifyInstance): RouteOptions => {
    return {
        method: "DELETE",
        async handler(
            req,
            res
        ) {
            const clientId: string = req.query["clientId"];
            const user = req.user;
            await deleteAuthorization(user, req.hydra, clientId);
            res.code(200);
            res.send();
        },
        url: "/self/authorizations",
        preHandler: server.auth([
            hydraCheckToken(["account.authorized.edit"])
        ] , {})
    };
};

export default deleteAuthorizationRoute;
