import { PREFIX } from "./consent";

export interface TwoFASessionReponse {
  webauth: { challenge: string; availableKeys: string[] };
  otp: boolean;
  username: string;
}

export async function fetchTwoFaSession(): Promise<TwoFASessionReponse> {
  const response = await fetch(`${PREFIX}/dialog/api/2fa`);
  return response.json();
}
