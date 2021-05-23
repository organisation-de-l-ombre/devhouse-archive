import { PREFIX } from "./consent";

export interface LoginFetchResponse {
  platforms: {
    name: string;
    color: string;
    url: string;
  }[];
  clientName: string;
}

export async function fetchLogin(
  challenge: string
): Promise<LoginFetchResponse> {
  const response = await fetch(
    `${PREFIX}/dialog/api/login?challenge=${challenge}`
  );
  return response.json();
}
