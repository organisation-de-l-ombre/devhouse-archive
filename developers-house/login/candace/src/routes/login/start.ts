/**
 * Starts a consent session using a consent_challenge.
 */
import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { Admin } from "../../utils/apis";
import { AxiosResponse } from "axios";
import { ConsentRequest } from "@ory/hydra-client";
import { randomBytes } from "crypto";
import { Providers } from "../../providers";

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
  async handler(request: FastifyRequest, response: FastifyReply) {
    const { challenge } = request.query as { challenge: string };
    const {
      data,
      status
    }: AxiosResponse<ConsentRequest> = await Admin.getLoginRequest(challenge);
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
        void response.code(200).send({ redirect: redirect.redirect_to });
        return;
      }
      request.session.login = {
        challenge,
        state: state
      };
      void response.code(200).send({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        platforms: [...Providers.values()].map((x) => ({
          ...x.meta(),
          url: x.getRedirectUri(state, `https://${request.headers.host || ""}`)
        })),
        clientName: data.client?.client_name
      });
      return;
    }
    void response.code(404).send({ code: 404, message: "No challenge." });
  }
};
