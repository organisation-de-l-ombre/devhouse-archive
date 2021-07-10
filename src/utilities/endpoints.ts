export const getAbderaEndpoint = (): string =>
  typeof window === "undefined" && process.env.NODE_ENV !== "development"
    ? "http://production.abdera-22309686-production.svc.cluster.local:5000"
    : "https://abdera-api.developershouse.xyz";
