import { NextApiRequest, NextApiResponse } from "next";
import { AxiosResponse } from "axios";
import { CompletedRequest } from "@ory/hydra-client";
import jwt from "jsonwebtoken";
import {
  ValidateConsentOptions,
  ValidateConsentReturn,
} from "../../../lib/rpc/fetchConsent";
import { Admin } from "../../../lib/admin";
import { TokenSession } from "./__rpc_get";

const handle = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== "POST")
    res.json({ error: `Invalid request. ${req.method}` });

  const body = req.body as ValidateConsentOptions;
  if (
    !body.challenge ||
    body.granted === undefined ||
    !body.scopes ||
    !body.audiences ||
    !Array.isArray(body.audiences) ||
    !Array.isArray(body.scopes) ||
    !body.token
  )
    return res.json({ error: "Invalid request." });
  const token = jwt.verify(
    body.token,
    "krfhkjdshvfdkhvfkdvhkdfhvkdfhvkfdjvhkfdvhkdfhvkfdhvdkf"
  ) as TokenSession | null;

  if (!token) return res.json({ error: "Invalid request." });

  if (body.granted && token.challenge === body.challenge) {
    const response: AxiosResponse<CompletedRequest> = await Admin.acceptConsentRequest(
      body.challenge,
      {
        grant_access_token_audience: body.audiences,
        grant_scope: body.scopes,
      }
    );
    if (response.data) {
      res.json({
        redirect: response.data.redirect_to,
      } as ValidateConsentReturn);
    }
  }
};

export default handle;
