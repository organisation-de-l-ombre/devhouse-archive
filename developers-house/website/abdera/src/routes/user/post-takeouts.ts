import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteOptions
} from "fastify";
import { postUserTakeout } from "../../logic/cryir-interface";
import { hydraCheckToken } from "../../middlewares/hydra-check-token";

const postTakeouts = (server: FastifyInstance): RouteOptions => {
  return {
    method: "POST",
    async handler(request: FastifyRequest, response: FastifyReply) {
      const user = request.user;

      void response.send(await postUserTakeout(user));
    },
    url: "/self/takeouts",
    preHandler: server.auth([hydraCheckToken(["account.takeouts.create"])], {})
  };
};

export default postTakeouts;
