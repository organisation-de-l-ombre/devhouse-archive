import { FastifyRequest, RouteOptions } from "fastify";
import { Admin } from "../../utils/apis";
import { AxiosResponse } from "axios";
import { ConsentRequest } from "@ory/hydra-client";
import { randomBytes } from "crypto";
import { Providers } from "../../providers";
import { CandaceError } from "../../utils/error";

export const loginStart: RouteOptions = {
  schema: {
    querystring: {
      required: ["challenge"],
      properties: {
        challenge: { type: "string" }
      }
    },
    response: {
      data: {
        properties: {
          audiences: { type: "array", items: { type: "string" } }
        }
      }
    }
  },
  url: "/dialog/api/login",
  method: "GET",
  async handler(request: FastifyRequest) {
    const { challenge } = request.query as { challenge: string };
    const { data, status }: AxiosResponse<ConsentRequest> =
      await Admin.getLoginRequest(challenge);
    const state = randomBytes(32).toString("base64");
    if (status === 200) {
      if (data.skip) {
        const { data: redirect } = await Admin.acceptLoginRequest(challenge, {
          subject: data.subject as string,
          context: {
            platform: "allg",
            autoLogin: true
          }
        });
        return {
          redirect: redirect.redirect_to,
          error: false
        };
      }
      request.session.login = {
        challenge,
        state: state
      };
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        platforms: [...Providers.values()].map((x) => ({
          ...x.meta(),
          url: x.getRedirectUri(state, `https://${request.headers.host || ""}`)
        })),
        clientName: data.client?.client_name,
        error: false
      };
    }
    throw new CandaceError(
      "400",
      "INVALID_CHALLENGE_LOGIN",
      "Invalid login challenge was specified."
    );
  }
};
