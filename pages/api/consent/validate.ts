import { NextApiRequest, NextApiResponse } from "next";
import { SessionData, withSession } from "next-session";
import { check } from "../../../service/csrf";
import { AdminAPI, validateHydraResponse } from "../../../service/hydra";

/*
 * Get the list of enabled features.
 */
async function handler(
  req: NextApiRequest & { session: SessionData },
  res: NextApiResponse
) {
  const {
    session: { csrf },
    body: { validate, challenge, _csrf },
  } = req;
  // Validate the csrf token and the request.
  if (csrf && validate && challenge && csrf && check(csrf, _csrf)) {
    if (validate === "accept") {
      const data = await AdminAPI.acceptConsentRequest(
        req.body["challenge"]
      ).then(validateHydraResponse);
      res.redirect(data.redirect_to);
    } else {
      // Reject.
      const data = await AdminAPI.rejectConsentRequest(challenge).then(
        validateHydraResponse
      );
      res.redirect(data.redirect_to);
    }
  } else {
    throw new Error("Invalid csrf of request.");
  }
}

export default withSession(handler);
