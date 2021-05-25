import { FastifyRequest, RouteOptions } from "fastify";
import { Admin, UserAPI } from "../../utils/apis";
import fetch from "node-fetch";
import { CandaceError } from "../../utils/error";

export const registerSubmit: RouteOptions = {
  schema: {
    body: {
      required: ["term", "private", "name", "captcha"],
      type: "object",
      properties: {
        term: { type: "boolean" },
        private: { type: "boolean" },
        name: { type: "string" },
        captcha: { type: "string" }
      }
    },
    response: {}
  },
  url: "/dialog/api/register",
  method: "POST",
  async handler(request: FastifyRequest) {
    const { register } = request.session;
    const user = request.body as {
      term: boolean;
      private: boolean;
      name: string;
      captcha: string;
    };
    if (!register) {
      throw new CandaceError(
        "400",
        "MISSING_SESSION_REGISTER",
        "No register session was specified."
      );
    }

    if (user.term && user.name.length > 3 && user.name.length < 33) {
      const response = await fetch(`https://hcaptcha.com/siteverify`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
        body: `response=${user.captcha}&secret=${
          process.env.HCAPTCHA_SECRET_KEY as string
        }`,
        method: "POST"
      });
      const validation = await response.json();

      if (!validation.success) {
        throw new CandaceError(
          "400",
          "CAPTCHA_INVALID",
          "Invalid captcha supplied."
        );
      }
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

        return {
          redirect: redirect.redirect_to,
          error: false
        };
      }
      throw new CandaceError(
        "500",
        "ELLIE_FAIL",
        "Ellie failed to process the user profile picture."
      );
    } else {
      throw new CandaceError(
        "400",
        "INVALID_USER",
        "Invalid user creation detected."
      );
    }
  }
};
