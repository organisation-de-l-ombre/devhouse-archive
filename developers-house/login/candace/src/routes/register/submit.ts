/**
 * Starts a consent session using a consent_challenge.
 */
import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { Admin, UserAPI } from "../../utils/apis";
import fetch from "node-fetch";
import { CandaceError } from "../../utils/error";

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
      throw new CandaceError("400", "MISSING_SESSION_REGISTER", "No register session was specified.");
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
        const { data } = await UserAPI.createUser({
          platform: register.user.provider,
          platform_id: register.user.id,
          pub: user.private,
          username: user.name,
          avatar: link
        });

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

        return response.send({ redirect: redirect.redirect_to });
      }
      throw new CandaceError("500", "ELLIE_FAIL", "Ellie failed to process the user profile picture.");
    } else {
      throw new CandaceError("400", "INVALID_USER", "Invalid user creation detected.");
    }
  }
};
