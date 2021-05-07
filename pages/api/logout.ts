import { NextApiRequest, NextApiResponse } from "next";
import { AxiosResponse } from "axios";
import { CompletedRequest } from "@ory/hydra-client";
import { withIronSession } from "next-iron-session";
import { ironSession } from "../../lib/options";
import { Admin } from "../../lib/admin";
import { ValidateLogoutRequest } from "../../lib/api/logout";

const handle = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== "POST")
    return res.json({ error: `Invalid request. ${req.method}` });

  const body = req.body as ValidateLogoutRequest;
  if (!body.challenge) return res.json({ error: "Invalid request." });
  const session = req.session.get<{
    challenge: string;
  }>("logoutSession");
  req.session.unset("logoutSession");
  console.log(session);

  if (session.challenge === body.challenge) {
    const response: AxiosResponse<CompletedRequest> = await Admin.acceptLogoutRequest(session.challenge).catch(
      () => ({ data: null } as AxiosResponse)
    );
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
