import { FastifyReply, FastifyRequest } from "fastify";
import { validateHydraResponse } from "../hydra";

function hydraCheckToken(scopes: string[]) {
  return async function (
    request: FastifyRequest,
    response: FastifyReply,
    next: () => unknown
  ): Promise<void> {
    let token = (request.query["auth_token"] ||
      request.headers.authorization) as string;
    if (token) {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7);
      }

      const resp = validateHydraResponse(
        await request.hydra.introspectOAuth2Token(token, scopes.join(" "))
      );
      const audiences = ["abdera"];

      if (
        // eslint-disable-next-line unicorn/no-array-reduce
        audiences.reduce(
          (valid, current) => valid && resp.aud.includes(current),
          true
        )
      ) {
        request.user = resp.sub;
        next();
        return;
      }
      request.user = resp.sub;
      next();
      return;
    }

    void response.code(401);
    void response.send();
  };
}
export { hydraCheckToken };
