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
const server = fastify({
  logger: true
});

declare module "fastify" {
  export interface Session {
    consent?: ConsentSession;
    login?: LoginSession;
    register?: RegisterSession;
    twoFa?: TwoFASession;
  }
}

void server.register(fastifyCookie);
void server.register(fastifySession, {
  secret: "shfvjkdshvkjsdhvkshvkdsjhvkshvksjdhvkshdkhj",
  cookie: {
    secure: false
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
  response
    .code(error.statusCode || 500)
    .send({ error: true, message: error.message });
})

server.get("/_healz", (request, response) => {
  void response.code(200).send();
});

void server.listen(5000);
