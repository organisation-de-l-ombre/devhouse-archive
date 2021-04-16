import { AdminApi, PreviousConsentSession } from "@oryd/hydra-client";
import { validateHydraResponse } from "../hydra";
import { Authorization } from "../../gen";

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

  return hydraResponse.map((client: PreviousConsentSession) => ({
    scopes: client.grant_scope,
    audiences: client.grant_access_token_audience,
    client: {
      name: client.consent_request.client.client_name,
      id: client.consent_request.client.client_id,
      tos: client.consent_request.client.tos_uri,
      image: client.consent_request.client.logo_uri,
    },
    grantedAt: client.handled_at,
  }));
}

async function logoutAll(user: string, hydra: AdminApi): Promise<void> {
  return validateHydraResponse(await hydra.revokeAuthenticationSession(user));
}

export { logoutAll, deleteAuthorization, getAuthorizations };
