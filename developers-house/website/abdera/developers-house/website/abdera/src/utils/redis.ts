import CreateRedis, { Redis } from "ioredis";

export function redisBuild(): Redis {
  if (process.env.NODE_ENV === "production") {
    return new CreateRedis({
      sentinels: [
        {
          host: process.env.REDIS_HOST as string,
          port: Number.parseInt(process.env.REDIS_PORT || "6379")
        }
      ],
      sentinelPassword: process.env.REDIS_PASSWORD,
      name: "mymaster"
    });
  }
  return new CreateRedis({
    sentinelPassword: process.env.REDIS_PASSWORD,
    name: "mymaster",
    host: "localhost"
  });
}
