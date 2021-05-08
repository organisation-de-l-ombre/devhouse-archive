/**
 * Starts a consent session using a consent_challenge.
 */
import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { Admin } from "../../utils/apis";
import { AxiosResponse } from "axios";
import { ConsentRequest } from "@ory/hydra-client";

export const consentStart: RouteOptions = {
  schema: {
    querystring: {
      required: ["challenge"],
      properties: {
        challenge: { type: "string" }
      }
    },
    response: {
      data: {
        required: ["audiences", "challenge", "clientName", "scopes"],
        properties: {
          audiences: { type: "array", items: { type: "string" } },
          challenge: { type: "string" },
          clientName: { type: "string" },
          tos: { type: "string" },
          image: { type: "string" },
          owner: { type: "string" },
          scopes: { type: "array", items: { type: "string" } },
          contact: { type: "array", items: { type: "string" } }
        }
      }
    }
  },
  url: "/dialog/api/consent",
  method: "GET",
  async handler(request: FastifyRequest, response: FastifyReply) {
    const { challenge } = request.query as { challenge: string };
    const {
      data,
      status
    }: AxiosResponse<ConsentRequest> = await Admin.getConsentRequest(challenge);
    if (status === 200) {
      request.session.consent = {
        audiences: data.requested_access_token_audience as string[],
        scopes: data.requested_scope as string[],
        challenge
      };
      void response.code(200).send({
        audiences: data.requested_access_token_audience,
        scopes: data.requested_scope,
        clientName: data.client?.client_name,
        tos: data.client?.tos_uri,
        image: data.client?.logo_uri,
        owner: data.client?.owner,
        contact: data.client?.contacts,
        challenge
      });
      return;
    }
    void response.code(404).send({ code: 404, message: "No challenge." });
  }
};
