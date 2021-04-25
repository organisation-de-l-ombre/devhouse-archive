import { NextApiRequest, NextApiResponse } from "next";
import { AxiosResponse } from "axios";
import { ConsentRequest } from "@ory/hydra-client";
import jwt from "jsonwebtoken";

import {
  GetConsentOptions,
  GetConsentReturn,
} from "../../../lib/rpc/fetchConsent";
import { Admin } from "../../../lib/admin";

export type TokenSession = Omit<Omit<GetConsentReturn, "token">, "clientName">;

const handle = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== "POST") return res.json({ success: false });

  const body = req.body as GetConsentOptions;
  if (!body.challenge) return res.json({ success: false });

  const axiosResponse: AxiosResponse<ConsentRequest> = await Admin.getConsentRequest(
    body.challenge
  ).catch(() => ({
    data: null,
    status: 0,
    config: {},
    statusText: "",
    headers: {},
    request: {},
  }));
  if (axiosResponse.data) {
    const sessionData: TokenSession = {
      audiences: axiosResponse.data.requested_access_token_audience,
      challenge: body.challenge,
      scopes: axiosResponse.data.requested_scope,
    };
    return res.json({
      token: jwt.sign(
        sessionData,
        "krfhkjdshvfdkhvfkdvhkdfhvkdfhvkfdjvhkfdvhkdfhvkfdhvdkf"
      ),
      clientName: axiosResponse.data.client.client_name,
      ...sessionData,
    } as GetConsentReturn);
  }
  res.statusCode = 400;
  return res.json({ success: false });
};

export default handle;
