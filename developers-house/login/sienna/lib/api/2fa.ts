import { PREFIX } from "./endpoint";
import { OrError } from "./error";

export interface TwoFASessionReponse {
  webauth: { challenge: string; availableKeys: string[] };
  otp: boolean;
  username: string;
}

export interface TwoFaSubmit {
  redirect: string;
}

export async function fetchTwoFaSession(): Promise<
  OrError<TwoFASessionReponse>
> {
  return fetch(`${PREFIX}/dialog/api/2fa`)
    .then((x) => x.json())
    .catch((e) => ({ error: true, message: e.message }));
}

export async function submitTwoFaSessionOTP(
  otp: number
): Promise<OrError<TwoFaSubmit>> {
  return fetch(`${PREFIX}/dialog/api/2fa`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      type: "otp",
      code: otp,
    }),
  })
    .then((x) => x.json())
    .catch((e) => ({ error: true, message: e.message }));
}
