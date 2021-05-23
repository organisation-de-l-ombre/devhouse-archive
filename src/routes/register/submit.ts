/**
 * Starts a consent session using a consent_challenge.
 */
import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { Admin, UserAPI } from "../../utils/apis";
import { UserCreate } from "@developers-house/scarlet";
import fetch from "node-fetch";

export const registerSubmit: RouteOptions = {
  schema: {
    body: {
      required: ["term", "private", "name"],
      type: "object",
      properties: {
        term: { type: "boolean" },
        private: { type: "boolean" },
        name: { type: "string" }
      }
    },
    response: {}
  },
  url: "/dialog/api/register",
  method: "POST",
  async handler(request: FastifyRequest, response: FastifyReply) {
    const { register } = request.session;
    const user = request.body as {
      term: boolean;
      private: boolean;
      name: string;
    };
    if (!register) {
      return response
        .code(400)
        .send({ code: 400, message: "Missing session." });
    }

    if (user.term && user.name.length > 3 && user.name.length < 33) {
      await new Promise((resolve) => request.destroySession(resolve));
      const resp = await fetch(
        `${
          process.env.ELLIE_ENDPOINT as string
        }/avatar-link?link=${encodeURIComponent(register.user.avatarURL)}`
      );
      if (resp.ok) {
        const { link } = await resp.json();
        const { data } = await UserAPI.createUser(({
          platform: register.user.provider,
          platform_id: register.user.id,
          private: user.private,
          username: user.name,
          avatar: link
        } as unknown) as UserCreate);

        const { data: redirect } = await Admin.acceptLoginRequest(
          register.challenge,
          {
            subject: data.id,
            context: {
              platform: register.user.provider
            },
            remember: true,
            remember_for: 3600
          }
        );
        delete request.session.register;

        return response.send({ redirect: redirect.redirect_to });
      }
    } else {
      return response.code(400).send({ code: 400, message: "Invalid user." });
    }
  }
};
