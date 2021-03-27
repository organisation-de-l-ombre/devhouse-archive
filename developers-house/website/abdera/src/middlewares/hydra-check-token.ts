import { FastifyReply, FastifyRequest } from "fastify";
import { validateHydraResponse } from "../hydra";

function hydraCheckToken (scopes: string[]) {
    return async function (req: FastifyRequest, res: FastifyReply, next: Function) {
        let token: string = req.query["auth_token"] || req.headers["Authorization"];
        if (token) {
            if (token.startsWith("Bearer ")) {
                token = token.slice(7)
            }

            const resp = validateHydraResponse(await req.hydra.introspectOAuth2Token(
                token,
                scopes.join(" "),
            ));
            const audiences = ["abdera"];

            if (audiences.reduce((valid, current) => valid && resp.aud.includes(current), true)) {
                req.user = resp.sub;
                next();
            }
        }

        res.code(401);
        res.send();
    }
}
export {
    hydraCheckToken
};