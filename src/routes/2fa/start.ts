import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { WebAuthAPI } from "../../utils/apis";
import { AxiosResponse } from "axios";
import { WebAuthKey } from "@developers-house/scarlet";
import { randomBytes } from "crypto";
import { CandaceError } from "../../utils/error";

export const twoFaStart: RouteOptions = {
  url: "/dialog/api/2fa",
  method: "GET",
  async handler(request: FastifyRequest, response: FastifyReply) {
    const { twoFa } = request.session;

    if (!twoFa) {
      throw new CandaceError("400", "MISSING_SESSION_2fa", "No 2fa session was specified.");
    }

    const {
      data
    }: AxiosResponse<WebAuthKey[]> = await WebAuthAPI.getUserWebAuthKeys(
      twoFa.user.id
    );

    let webauthChallenge;
    if (data.length > 0) {
      webauthChallenge = randomBytes(256).toString("base64");
      twoFa.webauthChallenge = webauthChallenge;
    }

    return {
      webauth: {
        challenge: webauthChallenge,
        availableKeys: data.map((x) => x.id)
      },
      otp: twoFa.user.a2f,
      username: twoFa.user.username,
      error: false,
    };
  }
};
