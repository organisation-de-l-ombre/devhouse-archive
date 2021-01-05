import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "next-session";
import {AdminAPI, validateHydraResponse} from "../../../lib/service/hydra";
import {check} from "../../../lib/service/csrf";
import {options} from "../../../lib/service/session";

/*
 * Get the list of enabled features.
 */
async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    session: { csrfKey, logout: { logoutChallenge }, },
    body: { validate, challenge, _csrf },
  } = req;

  // Validate the csrf token and the request.
  if (_csrf && validate && challenge && csrfKey && check(csrfKey, _csrf)) {
    // If the user accepted.
    if (logoutChallenge === challenge) {
      if (validate === "accept") {
        // we fetch the user from
        const data = await AdminAPI.acceptLogoutRequest(challenge).then(validateHydraResponse);
        res.redirect(data.redirect_to);
        return;
      }
      if (validate === "reject") {
        // Reject.
        await AdminAPI.rejectLogoutRequest(challenge).then(
            validateHydraResponse
        );
        return;
      }
    }
    throw new Error("Invalid action.");
  }
  throw new Error("Invalid csrf of request.");
}

export default withSession(handler, options);
