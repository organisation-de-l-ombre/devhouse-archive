import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { Providers } from "../../providers";
import { Admin, LoginAPI } from "../../utils/apis";
import { AxiosResponse } from "axios";
import {
  InlineResponse200, InlineResponse200StatusEnum,
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
      return response.redirect(
        "/dialog/error?error_message=" +
        encodeURIComponent("Invalid session.")
      );
    }

    if (login.state !== state) {
      return response.redirect(
        "/dialog/error?error_message=" +
        encodeURIComponent("Failed to validate state.")
      );
    }

    const instance = Providers.get(provider.toLowerCase());
    if (!instance) {
      return response.redirect(
        "/dialog/error?error_message=" +
        encodeURIComponent("Invalid loginn provider specified.")
      );
    }

    delete request.session.login;
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

    switch (data.status) {
      case InlineResponse200StatusEnum.Failed: // Banned account
        return response.redirect(
          "/dialog/error?error_message=" +
          encodeURIComponent("Couldn't access this account.")
        );
      case InlineResponse200StatusEnum.UnknownUser: // Bad request
        return response.redirect(
          "/dialog/error?error_message=" +
          encodeURIComponent("internal: Scarlet returned unknown user.")
        );
      case InlineResponse200StatusEnum.TwoFactorRequired: // 2FA Required.
        if (data.user) {
          request.session.twoFa = {
            user: data.user,
            challenge: login.challenge,
            login: { platform_id: user.id, platform_name: provider },
          };
          return response.redirect("/dialog/2fa");
        } else {
          return response.redirect(
            "/dialog/error?error_message=" +
            encodeURIComponent("internal: Scarlet returned invalid response for 2fa user.")
          );
        }
        break;
      case InlineResponse200StatusEnum.UnknownUser: // Register
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
      case InlineResponse200StatusEnum.Success: // User successful
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
        } else {
          return response.redirect(
            "/dialog/error?error_message=" +
            encodeURIComponent("internal: Scarlet returned invalid response for 2fa user.")
          );
        }
        break;
    }
  }
};
