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
export const PREFIX =
  process.env.NODE_ENV === "development"
    ? "https://auth-server.developershouse.xyz"
    : "";

export async function fetchConsent(
  challenge: string
): Promise<ConsentFetchResponse> {
  const response = await fetch(
    `${PREFIX}/dialog/api/consent?challenge=${challenge}`
  );
  return response.json();
}
