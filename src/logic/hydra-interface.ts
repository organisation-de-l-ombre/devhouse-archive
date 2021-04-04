import { AdminApi } from "@oryd/hydra-client";
import { validateHydraResponse } from "../hydra";
import { Authorization  } from "../../gen";

async function deleteAuthorization (user: string, hydra: AdminApi, client?: string) {
    return validateHydraResponse(await hydra.revokeConsentSessions(user, client, !client));
}

async function getAuthorizations (user: string, hydra: AdminApi): Promise<Authorization[]> {
    const ret = validateHydraResponse(await hydra.listSubjectConsentSessions(user));

    return ret.map((client) => {
        return {
            scopes: client.grant_scope,
            audiences: client.grant_access_token_audience,
            client: {
                name: client.consent_request.client.client_name,
                id: client.consent_request.client.client_id,
                tos: client.consent_request.client.tos_uri,
                image: client.consent_request.client.logo_uri,
            },
            grantedAt: client.handled_at,
        } as Authorization;
    })
}

async function logoutAll (user: string, hydra: AdminApi) {
    return validateHydraResponse(await hydra.revokeAuthenticationSession(user));
}

export {
    logoutAll,
    deleteAuthorization,
    getAuthorizations
};