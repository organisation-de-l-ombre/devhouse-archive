import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "next-session";
import { AdminAPI, validateHydraResponse } from "../../../lib/service/hydra";
import { check } from "../../../lib/service/csrf";
import { options } from "../../../lib/service/session";

/*
 * Get the list of enabled features.
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session: {
      csrfKey,
      consent: { scopes, audiences, user, consentChallenge },
    },
    body: { validate, challenge, _csrf },
  } = req;

  // Validate the csrf token and the request.
  if (
    _csrf &&
    validate &&
    audiences &&
    challenge &&
    csrfKey &&
    check(csrfKey, _csrf) &&
    scopes
  ) {
    // If the user accepted.
    if (consentChallenge === challenge) {
      if (validate === "accept") {
        // we fetch the user from
        const data = await AdminAPI.acceptConsentRequest(challenge, {
          grant_scope: scopes,
          grant_access_token_audience: audiences,
          session: {
            id_token: {
              ...user,
              ban: undefined,
              uuid: undefined,
            },
          },
          remember_for: 3600 * 24,
          remember: true,
        }).then(validateHydraResponse);
        res.redirect(data.redirect_to);
        return;
      }
      if (validate === "reject") {
        // Reject.
        const data = await AdminAPI.rejectConsentRequest(challenge).then(
          validateHydraResponse
        );
        res.redirect(data.redirect_to);
        return;
      }
    }
    throw new Error("Invalid action.");
  }
  throw new Error("Invalid csrf of request.");
}

export default withSession(handler, options);
