import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from "fastify";
import { deleteAuthorization } from "../../logic/hydra-interface";
import { hydraCheckToken } from "../../middlewares/hydra-check-token";

const deleteAuthorizationRoute = (server: FastifyInstance): RouteOptions => {
  return {
    method: "DELETE",
    async handler(request: FastifyRequest, response: FastifyReply) {
      let clientId: string | undefined = (
        request.query as {
          [key: string]: unknown;
        }
      )["clientId"] as string;

      if (clientId === "") {
        clientId = undefined;
      }

      const user = request.user;

      await deleteAuthorization(user, request.hydra, clientId);

      void response.send();
    },
    url: "/self/authorizations",
    preHandler: server.auth([hydraCheckToken(["account.authorized.edit"])], {})
  };
};

export default deleteAuthorizationRoute;
