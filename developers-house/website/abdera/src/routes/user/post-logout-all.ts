import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from "fastify";
import { logoutAll } from "../../logic/hydra-interface";
import { hydraCheckToken } from "../../middlewares/hydra-check-token";

const postLogoutAll = (server: FastifyInstance): RouteOptions => {
  return {
    method: "POST",
    async handler(request: FastifyRequest, response: FastifyReply) {
      const user = request.user;
      void response.send(await logoutAll(user, request.hydra));
    },
    url: "/self/logoutAll",
    preHandler: server.auth([hydraCheckToken(["account.authorized.edit"])], {})
  };
};

export default postLogoutAll;
