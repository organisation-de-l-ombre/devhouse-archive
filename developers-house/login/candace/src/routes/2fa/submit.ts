/**
 * Starts a consent session using a consent_challenge.
 */
import { Login } from "@developers-house/scarlet";
import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { Admin, LoginAPI, UserAPI } from "../../utils/apis";

export const twoFaSubmit: RouteOptions = {
    schema: {
        body: {
            required: ["type"],
            type: "object",
            properties: {
                type: { type: "string" },
                otp: { type: "number" },
            }
        },
        response: {}
    },
    url: "/dialog/api/2fa",
    method: "POST",
    async handler(request: FastifyRequest, response: FastifyReply) {
        const { type } = request.body as { type: string };
        const { twoFa } = request.session;
        if (!twoFa) {
            return response.code(400).send({ code: 400, message: "No session." });
        }

        const data: Login = { with_platform: twoFa.login };

        if (type === "otp") {
            const { code } = request.body as { code: number };
            data.with_otp = { code };
        } else if (type === "webauth") {
            // TODO.
        } else {
            throw new Error("Invalid.");
        }
        const { data: responseData } = await LoginAPI.doLogin(data);
        console.log(responseData);
        if (responseData.user) {
            const { data: redirect } = await Admin.acceptLoginRequest(
                twoFa.challenge,
                {
                    subject: responseData.user.id,
                    context: {
                        platform: twoFa.login.platform_name,
                    },
                    remember: true,
                    remember_for: 3600
                }
            );
            delete request.session.twoFa;
            void response.code(200).send({ redirect: redirect.redirect_to });
        }
        throw new Error("Invalid.");
    }
};
