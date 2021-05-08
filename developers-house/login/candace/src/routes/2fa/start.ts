/**
 * Starts a consent session using a consent_challenge.
 */
import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { WebAuthAPI } from "../../utils/apis";
import { AxiosResponse } from "axios";
import { WebAuthKey } from "@developers-house/scarlet";

export const twoFaStart: RouteOptions = {
  url: "/dialog/api/2fa",
  method: "GET",
  async handler(request: FastifyRequest, response: FastifyReply) {
    const { twoFa } = request.session;
    if (!twoFa) {
      return response.code(400).send({ code: 400, message: "No session." });
    }

    const {
      data
    }: AxiosResponse<WebAuthKey[]> = await WebAuthAPI.getUserWebAuth(
      twoFa.user.id
    );

    return {
      webauth: {
        challenge: "",
        availableKeys: data.map((x) => ({ id: x.id }))
      },
      otp: twoFa.user.a2f
    };
  }
};
