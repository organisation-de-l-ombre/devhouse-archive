/*
 * The route to get all the staff members.
 */

import {FastifyReply, FastifyRequest, RouteOptions} from "fastify";
import { validateHydraResponse } from '../hydra';

const user: RouteOptions = {
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
            hydra: {
                introspectOAuth2Token,
            },
        } = req;

        const { active, aud, sub } = await introspectOAuth2Token(token, 'account:all').then(validateHydraResponse);

        if (!active || !aud.includes('website')) {
            throw new Error('Invalidate token.');
        }

        res.send({
            publicAccount: false,
            username: sub,
            id: sub,
            profilePicture: '__placeholder__',
        });
    },
    url: "/users/:user",
};

export default user;
