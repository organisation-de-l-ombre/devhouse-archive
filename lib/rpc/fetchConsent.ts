const VALIDATE_CONSENT_ENDPOINT = "/dialog/api/consent/__rpc_validate";
const GET_CONSENT_ENDPOINT = "/dialog/api/consent/__rpc_get";

export interface ValidateConsentOptions {
  granted: boolean;
  challenge: string;
  scopes: string[];
  audiences: string[];
  token: string;
}

export interface ValidateConsentReturn {
  redirect: string;
}

export interface GetConsentOptions {
  challenge: string;
}

export interface GetConsentReturn {
  clientName: string;
  scopes: string[];
  audiences: string[];
  challenge: string;
  token: string;
}

export async function validateConsent(
  options: ValidateConsentOptions
): Promise<ValidateConsentReturn> {
  const fetchResult = await fetch(VALIDATE_CONSENT_ENDPOINT, {
    method: "post",
    body: JSON.stringify(options),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (fetchResult.ok) {
    return fetchResult.json();
  }
  return null;
}

export async function getConsent(
  options: GetConsentOptions
): Promise<GetConsentReturn> {
  const fetchResult = await fetch(GET_CONSENT_ENDPOINT, {
    method: "post",
    body: JSON.stringify(options),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (fetchResult.ok) {
    return fetchResult.json();
  }
  return null;
}
