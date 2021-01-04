/*
 * The route to get all the staff members.
 */

import {FastifyReply, FastifyRequest, RouteOptions} from "fastify";
import { validateHydraResponse } from '../hydra';

const getConsents: RouteOptions = {
    method: 'GET',
    errorHandler: function (error: Error, _: FastifyRequest, reply: FastifyReply): void {
        /*
         * The error handler.
         */
        reply.code(500);
        reply.send({
            code: 500,
            message: error.message,
        });
        reply.raw.end();
    },
    async handler(req, res) {
        if (!req.headers['authorization']) {
            throw new Error('Please provider a token for this request.');
        }
        const token = req.headers['authorization'].slice(7);
        const {
            hydra,
        } = req;

        const { active, aud, sub } = await hydra.introspectOAuth2Token(token, 'account:all').then(validateHydraResponse);

        if (!active || !aud.includes('website')) {
            throw new Error('Invalidate token.');
        }

        const sessions = await hydra.listSubjectConsentSessions(sub).then(validateHydraResponse);

        return sessions.map((a) => {
            return {
                name: a.consent_request.client.client_name,
                id: a.consent_request.client.client_id,
                at: a.handled_at,
                scopes: a.grant_scope,
                audience: a.grant_access_token_audience,
            };
        });
        
    },
    url: "/users/consents",
};

export default getConsents;
