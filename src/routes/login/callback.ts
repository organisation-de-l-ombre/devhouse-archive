/**
 * Starts a consent session using a consent_challenge.
 */
import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { Providers } from "../../providers";
import { Admin, LoginAPI } from "../../utils/apis";
import { AxiosResponse } from "axios";
import {
  InlineResponse200,
  InlineResponse200CodeEnum
} from "@developers-house/scarlet";

export const loginCallback: RouteOptions = {
  schema: {
    querystring: {
      required: ["code", "state"],
      properties: {
        code: { type: "string" },
        state: { type: "string" }
      }
    },
    response: {}
  },
  url: "/dialog/api/callback/:provider",
  method: "GET",
  async handler(request: FastifyRequest, response: FastifyReply) {
    const { login } = request.session;
    const { code, state } = request.query as { code: string; state: string };
    const { provider } = request.params as { provider: string };
    if (!login) {
      return response
        .code(400)
        .send({ code: 400, message: "Missing session." });
    }

    if (login.state !== state) {
      return response
        .code(400)
        .send({ code: 400, message: "Invalid session." });
    }

    const instance = Providers.get(provider.toLowerCase());
    if (!instance) {
      return response
        .code(400)
        .send({ code: 400, message: "Invalid provider." });
    }

    const token = await instance.exchangeCode(
      code,
      `https://${request.headers.host as string}`
    );
    const user = await instance.getUserData(token);

    const { data }: AxiosResponse<InlineResponse200> = await LoginAPI.doLogin({
      with_platform: {
        platform_id: user.id,
        platform_name: provider
      }
    });

    switch (data.code) {
      case InlineResponse200CodeEnum.NUMBER_1: // Banned account
        void response.redirect(
          "/dialog/error?error_message=" +
            encodeURIComponent("This account is banned.")
        );
        break;
      case InlineResponse200CodeEnum.NUMBER_2: // Bad request
        break;
      case InlineResponse200CodeEnum.NUMBER_4: // 2FA Required.
        if (data.user) {
          request.session.twoFa = {
            user: data.user,
            challenge: login.challenge
          };
          delete request.session.login;
          return response.redirect("/dialog/2fa");
        }
        break;
      case InlineResponse200CodeEnum.NUMBER_5: // Register
        request.session.register = {
          user,
          challenge: login.challenge
        };
        delete request.session.login;
        return response.redirect(
          "/dialog/register?username=" +
            encodeURIComponent(user.username) +
            "&avatar=" +
            encodeURIComponent(user.avatarURL)
        );
      case InlineResponse200CodeEnum.NUMBER_153: // Internal error
        void response.redirect(
          "/dialog/error?error_message=" +
            encodeURIComponent("An internal error occured.")
        );
        delete request.session.login;
        break;
      case InlineResponse200CodeEnum.NUMBER_200: // User successful
        if (data.user) {
          const { data: redirect } = await Admin.acceptLoginRequest(
            login.challenge,
            {
              subject: data.user.id,
              context: {
                platform: provider
              },
              remember: true,
              remember_for: 3600
            }
          );
          delete request.session.login;
          void response.redirect(redirect.redirect_to);
        }
        break;
    }
  }
};
