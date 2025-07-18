import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from "fastify";
import { getUserTakeouts } from "../../logic/cryir-interface";
import { hydraCheckToken } from "../../middlewares/hydra-check-token";

const getTakeouts = (server: FastifyInstance): RouteOptions => {
  return {
    method: "GET",
    async handler(request: FastifyRequest, response: FastifyReply) {
      const user = request.user;

      void response.send((await getUserTakeouts(user)).data);
    },
    url: "/self/takeouts",
    preHandler: server.auth([hydraCheckToken(["account.takeouts.list"])], {})
  };
};

export default getTakeouts;
