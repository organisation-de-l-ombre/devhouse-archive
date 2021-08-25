import { initTracerFromEnv, TracingConfig } from "jaeger-client";

const config: TracingConfig = {
  serviceName: "abdera"
};

export const Tracer = initTracerFromEnv(config, {});
