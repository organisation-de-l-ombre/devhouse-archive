import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import unleash from "unleash-client";

unleash.initialize({
  url: "https://gitlab.com/api/v4/feature_flags/unleash/21654973",
  appName: "production",
  environment: "production",
  instanceId: "USbeLowCufaWzxRu3np3"
});

const getFeatureFlags: RouteOptions = {
  method: "GET",
  handler(request: FastifyRequest, response: FastifyReply) {
    const query = request.query as { flags: string };
    if (query && query.flags) {
      const flags = query.flags.split(",");

      void response.send(
        flags
          .map((name) => ({ name, enabled: unleash.isEnabled(name) }))
          .filter(({ enabled }) => enabled)
          .map(({ name }) => name)
      );
    }
  },
  url: "/data/featureflags"
};

export { getFeatureFlags };
