import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from "fastify";
import { getAuthorizations } from "../../logic/hydra-interface";
import { hydraCheckToken } from "../../middlewares/hydra-check-token";

const getAuthorizationsRoute = (server: FastifyInstance): RouteOptions => {
  return {
    method: "GET",
    async handler(request: FastifyRequest, response: FastifyReply) {
      const user = request.user;
      void response.send(await getAuthorizations(user, request.hydra));
    },
    url: "/self/authorizations",
    preHandler: server.auth([hydraCheckToken(["account.authorized.read"])], {})
  };
};

export default getAuthorizationsRoute;
