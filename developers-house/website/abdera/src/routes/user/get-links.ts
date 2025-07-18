import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from "fastify";
import { hydraCheckToken } from "../../middlewares/hydra-check-token";

const getLinksRoute = (server: FastifyInstance): RouteOptions => {
  return {
    method: "GET",
    async handler(request: FastifyRequest, response: FastifyReply) {
      const user = request.user;
      const links = await request.scarlet.links.getUserLinks(user);
      void response.send(links.data);
    },
    url: "/self/links",
    preHandler: server.auth([hydraCheckToken(["account.links"])], {})
  };
};

export default getLinksRoute;
