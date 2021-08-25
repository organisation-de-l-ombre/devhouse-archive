import { AdminApi, PreviousConsentSession } from "@ory/hydra-client";
import { validateHydraResponse } from "../hydra";
import { Authorization } from "../types/models/Authorization";

async function deleteAuthorization(
  user: string,
  hydra: AdminApi,
  client?: string
): Promise<void> {
  return validateHydraResponse(
    await hydra.revokeConsentSessions(user, client, !client)
  );
}

async function getAuthorizations(
  user: string,
  hydra: AdminApi
): Promise<Authorization[]> {
  const hydraResponse = validateHydraResponse(
    await hydra.listSubjectConsentSessions(user)
  );

  return hydraResponse
    .map<Authorization | undefined>(
      (client: PreviousConsentSession): Authorization | undefined => {
        if (client.consent_request?.client) {
          return {
            scopes: client.grant_scope as string[],
            audiences: client.grant_access_token_audience as string[],
            client: {
              name: client.consent_request.client.client_name || "",
              id: client.consent_request.client.client_id as string,
              tos: client.consent_request.client.tos_uri as string,
              image: client.consent_request.client.logo_uri as string
            },
            grantedAt: client.handled_at as string
          };
        }
      }
    )
    .filter((item) => item !== undefined) as Authorization[];
}

async function logoutAll(user: string, hydra: AdminApi): Promise<void> {
  return validateHydraResponse(await hydra.revokeAuthenticationSession(user));
}

export { logoutAll, deleteAuthorization, getAuthorizations };
