/**
 * Starts a consent session using a consent_challenge.
 */
import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { Admin } from "../../utils/apis";

export const consentSubmit: RouteOptions = {
  schema: {
    body: {
      required: ["granted"],
      type: "object",
      properties: {
        granted: { type: "boolean" }
      }
    },
    response: {}
  },
  url: "/dialog/api/consent",
  method: "POST",
  async handler(request: FastifyRequest, response: FastifyReply) {
    const { consent } = request.session;
    const { granted } = request.body as { granted: boolean };
    if (!consent) {
      return response
        .code(400)
        .send({ code: 400, message: "Missing session." });
    }
    const function_ = (granted
      ? // eslint-disable-next-line @typescript-eslint/unbound-method
        Admin.acceptConsentRequest
      : // eslint-disable-next-line @typescript-eslint/unbound-method
        Admin.rejectConsentRequest
    ).bind(Admin);
    const { status, data } = await function_(
      consent.challenge,
      granted
        ? {
            grant_access_token_audience: consent.audiences,
            grant_scope: consent.scopes
          }
        : {}
    );
    if (status === 200) {
      delete request.session.consent;
      void response.code(200).send({ redirect: data.redirect_to });
      return;
    }

    void response.code(200).send(consent);
  }
};
