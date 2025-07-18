import { initTracerFromEnv } from "jaeger-client";

const config = {
  serviceName: "website-render",
};

export const Tracer = initTracerFromEnv(config, {});
