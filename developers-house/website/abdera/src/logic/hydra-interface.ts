import { AdminApi } from "@oryd/hydra-client";
import { validateHydraResponse } from "../hydra";

async function deleteAuthorization (user: string, hydra: AdminApi, client?: string) {
    return validateHydraResponse(await hydra.revokeConsentSessions(user, client, !user));
}

async function getAuthorizations (user: string, hydra: AdminApi) {
    return validateHydraResponse(await hydra.listSubjectConsentSessions(user));
}

async function logoutAll (user: string, hydra: AdminApi) {
    return validateHydraResponse(await hydra.revokeAuthenticationSession(user));
}

export {
    logoutAll,
    deleteAuthorization,
    getAuthorizations
};