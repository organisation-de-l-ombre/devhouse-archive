import { FastifyReply, FastifyRequest } from "fastify";
import jwksClient from "jwks-rsa";
import { decode, verify } from "jsonwebtoken";

const jwks = jwksClient({
  jwksUri: "https://auth-server.developershouse.xyz/.well-known/jwks.json"
});

function wildTest(wildcard: string, string: string) {
  const w = wildcard.replace(/[$()+.[\\\]^{|}]/g, "\\$&"); // regexp escape
  // eslint-disable-next-line security/detect-non-literal-regexp
  const re = new RegExp(`^${w.replace(/\*/g, ".*").replace(/\?/g, ".")}$`, "i");
  return re.test(string); // remove last 'i' above to have case sensitive
}

function validateScopes(scopes: string[], scopesOnToken: string[]): boolean {
  for (const scope of scopes) {
    let done = false;
    for (const scopesCheck of scopesOnToken) {
      if (wildTest(scopesCheck, scope)) {
        done = true;
        break;
      }
    }
    if (!done) {
      return false;
    }
  }
  return true;
}

function hydraCheckToken(scopes: string[]) {
  return async function (
    request: FastifyRequest,
    response: FastifyReply,
    next: () => unknown
  ): Promise<void> {
    let token = ((request.query as { [key: string]: unknown }).auth_token ||
      request.headers.authorization) as string;
    if (token) {
      // remove the "bearer prefix"
      if (token.startsWith("Bearer ")) {
        token = token.slice(7);
      }
      const decodedToken = decode(token, { complete: true });
      if (
        decodedToken &&
        decodedToken.header.kid &&
        decodedToken.payload.sub &&
        decodedToken.payload.aud &&
        decodedToken.payload.aud.includes("abdera") &&
        validateScopes(scopes, decodedToken.payload.scp)
      ) {
        const key = await jwks.getSigningKey(decodedToken.header.kid);
        try {
          if (verify(token, key.getPublicKey())) {
            request.user = decodedToken.payload.sub;
            next();
            return;
          }
        } catch {
          /* we can safely ignore errors */
        }
      }
    }

    void response.code(401);
    void response.send();
  };
}
export { hydraCheckToken };
