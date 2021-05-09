import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from "fastify";
import { hydraCheckToken } from "../../middlewares/hydra-check-token";

const getSelfRoute = (server: FastifyInstance): RouteOptions => {
  return {
    method: "GET",
    async handler(request: FastifyRequest, response: FastifyReply) {
      const userId = request.user;
      const user = await request.scarlet.user.getUser(userId);
      void response.send(user.data);
    },
    url: "/self",
    preHandler: server.auth([hydraCheckToken(["account.self.read"])], {})
  };
};

export default getSelfRoute;
