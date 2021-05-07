import { NextApiRequest, NextApiResponse } from "next";
import { AxiosResponse } from "axios";
import { CompletedRequest } from "@ory/hydra-client";
import { withIronSession } from "next-iron-session";
import { ironSession } from "../../lib/options";
import { ValidateConsentOptions } from "../../lib/api/consent";
import { Admin } from "../../lib/admin";

const handle = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== "POST")
    return res.json({ error: `Invalid request. ${req.method}` });

  const body = req.body as ValidateConsentOptions;
  if (!body.challenge || body.granted === undefined)
    return res.json({ error: "Invalid request." });

  const session = req.session.get<{
    scopes: string[];
    clientName: string;
    audiences: string[];
    challenge: string;
  }>("consentSession");
  req.session.unset("consentSession");

  if (session.challenge === body.challenge) {
    let response: AxiosResponse<CompletedRequest>;
    if (body.granted) {
      response = await Admin.acceptConsentRequest(session.challenge).catch(
        () => ({ data: null } as AxiosResponse)
      );
    } else {
      response = await Admin.rejectConsentRequest(session.challenge).catch(
        () => ({ data: null } as AxiosResponse)
      );
    }
    if (!response.data) {
      res.statusCode = 500;
      return res.json({ code: 500 });
    }
    return res.json({ code: 200, redirect: response.data.redirect_to });
  }
  res.statusCode = 400;
  return res.json({ code: 400, message: "Bad request." });
};

export default withIronSession(handle, ironSession());
