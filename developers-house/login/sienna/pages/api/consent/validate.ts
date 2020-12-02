import { NextApiRequest, NextApiResponse } from "next";
import { SessionData, withSession } from "next-session";
import {AdminAPI, validateHydraResponse} from "../../../lib/service/hydra";
import {check} from "../../../lib/service/csrf";
import {options} from "../../../lib/service/session";

/*
 * Get the list of enabled features.
 */
async function handler(
  req: NextApiRequest & { session: SessionData },
  res: NextApiResponse
) {
  const {
    session: { csrf, scopes },
    body: { validate, challenge, _csrf },
  } = req;

  // Validate the csrf token and the request.
  if (csrf && validate && challenge && csrf && check(csrf, _csrf) && scopes) {
    // If the user accepted.
    if (validate === "accept") {
      const data = await AdminAPI.acceptConsentRequest(req.body["challenge"], {
        grant_scope: scopes,
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
    throw new Error("Invalid action.");
  }
  throw new Error("Invalid csrf of request.");
}

export default withSession(handler, options);
