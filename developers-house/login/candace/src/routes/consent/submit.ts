/**
 * Starts a consent session using a consent_challenge.
 */
import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { Admin, UserAPI } from "../../utils/apis";
import { CandaceError } from "../../utils/error";

export type ConsentSubmitResponse = {
  redirect: string;
};

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
      throw new CandaceError("400", "MISSING_CONSENT_SESSION", "You need a consent session to interact with this endpoint.");
    }
    const function_ = (granted
      ? // eslint-disable-next-line @typescript-eslint/unbound-method
        Admin.acceptConsentRequest
      : // eslint-disable-next-line @typescript-eslint/unbound-method
        Admin.rejectConsentRequest
    ).bind(Admin);

    const { data: user } = await UserAPI.getUser(consent.sub);
    const { status, data } = await function_(
      consent.challenge,
      granted
        ? {
            grant_access_token_audience: consent.audiences,
            grant_scope: consent.scopes,
            remember: true,
            remember_for: 0,
            session: {
              id_token: user,
            }
          }
        : {}
    );
    if (status === 200) {
      await new Promise((resolve) => request.destroySession(resolve));
      void response.code(200).send({ redirect: data.redirect_to });
      return;
    }

    throw new CandaceError("400", "FAILED_CONSENT_VALIDATION", "Failed to validate the consent validation.");
  }
};
