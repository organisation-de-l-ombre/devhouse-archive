import fastify from "fastify";
import { consentStart } from "./routes/consent/start";
import fastifySession from "fastify-session";
import fastifyCookie from "fastify-cookie";
import { consentSubmit } from "./routes/consent/submit";
import { ConsentSession } from "./routes/consent/types";
import { LoginSession } from "./routes/login/types";
import { loginStart } from "./routes/login/start";
import { loginCallback } from "./routes/login/callback";
import { RegisterSession } from "./routes/register/types";
import { TwoFASession } from "./routes/2fa/types";
import { registerSubmit } from "./routes/register/submit";
import { twoFaStart } from "./routes/2fa/start";
import { twoFaSubmit } from "./routes/2fa/submit";
import connectRedis from "connect-redis";
import CreateRedis from "ioredis";
const server = fastify({
  logger: true,
  trustProxy: 1
});

const Redis = new CreateRedis({
  sentinels: [
    {
      host: process.env.REDIS_HOST as string,
      port: Number.parseInt(process.env.REDIS_PORT || "6379")
    }
  ],
  sentinelPassword: process.env.REDIS_PASSWORD,
  name: "mymaster"
});

declare module "fastify" {
  export interface Session {
    consent?: ConsentSession;
    login?: LoginSession;
    register?: RegisterSession;
    twoFa?: TwoFASession;
  }
}

const RedisStore = connectRedis(fastifySession as never);

void server.register(fastifyCookie);
void server.register(fastifySession, {
  secret: process.env.SECRET_KEY as string,
  store: new RedisStore({ client: Redis, ttl: 3600 }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: true,
    maxAge: 3060,
    expires: 3600
  }
});

server.route(consentStart);
server.route(consentSubmit);
server.route(loginStart);
server.route(loginCallback);
server.route(registerSubmit);
server.route(twoFaStart);
server.route(twoFaSubmit);

server.setErrorHandler((error, _, response) => {
  void response
    .code(error.statusCode || 500)
    .send({ error: true, message: error.message });
});

server.get("/_healz", (request, response) => {
  void response.code(200).send();
});

void server.listen(5000);
