import { PREFIX } from "./endpoint";
import { OrError } from "./error";

export interface LoginFetchResponse {
  platforms: {
    name: string;
    color: string;
    url: string;
  }[];
  clientName: string;
  redirect?: string;
}

export async function fetchLogin(
  challenge: string
): Promise<OrError<LoginFetchResponse>> {
  return fetch(`${PREFIX}/dialog/api/login?challenge=${challenge}`)
    .then((x) => x.json())
    .catch((e) => ({ error: true, message: e.message }));
}
