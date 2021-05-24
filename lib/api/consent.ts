import { PREFIX } from "./endpoint";
import { OrError } from "./error";

export interface ConsentFetchResponse {
  audiences: string[];
  challenge: string;
  clientName: string;
  tos: string;
  image: string;
  owner: string;
  scopes: string[];
  contact: string[];

  redirect?: string;
}

export async function fetchConsent(
  challenge: string
): Promise<ConsentFetchResponse> {
  return fetch(`${PREFIX}/dialog/api/consent?challenge=${challenge}`)
    .then((x) => x.json())
    .catch((e) => ({ error: true, message: e.message }));
}

export async function validateConsent(
  granted: boolean
): Promise<OrError<{ redirect: string }>> {
  return fetch("/dialog/api/consent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      granted,
    }),
  })
    .then((x) => x.json())
    .catch((e) => ({ error: true, message: e.message }));
}
