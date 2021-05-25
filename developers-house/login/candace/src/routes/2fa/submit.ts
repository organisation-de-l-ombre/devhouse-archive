import { InlineResponse200StatusEnum, Login } from "@developers-house/scarlet";
import { FastifyRequest, RouteOptions } from "fastify";
import { Admin, LoginAPI } from "../../utils/apis";
import { CandaceError } from "../../utils/error";

export interface TwoFaSubmitResponse {
  redirect: string;
}

export const twoFaSubmit: RouteOptions = {
  schema: {
    body: {
      required: ["type"],
      type: "object",
      properties: {
        type: { type: "string" },
        otp: { type: "number" }
      }
    },
    response: {}
  },
  url: "/dialog/api/2fa",
  method: "POST",
  async handler(request: FastifyRequest) {
    const { type } = request.body as { type: string };
    const { twoFa } = request.session;
    if (!twoFa) {
      throw new CandaceError(
        "400",
        "MISSING_2FA_SESSION",
        "A 2fa session is required to call the 2fa endpoint."
      );
    }

    const data: Login = { with_platform: twoFa.login };

    if (type === "otp") {
      const { code } = request.body as { code: number };
      data.with_otp = { code };
    } else if (type === "webauth") {
      // TODO.
    } else {
      throw new CandaceError(
        "400",
        "INVALID_2FA_VALIDATION_TYPE",
        "Invalid 2fa validation provided to the submit endpoint."
      );
    }

    const { data: responseData } = await LoginAPI.doLogin(data);
    delete request.session.twoFa;

    if (
      responseData.status === InlineResponse200StatusEnum.Success &&
      responseData.user
    ) {
      const { data: redirect } = await Admin.acceptLoginRequest(
        twoFa.challenge,
        {
          subject: responseData.user.id,
          context: {
            platform: twoFa.login.platform_name,
            two_fa: type
          },
          remember: true,
          remember_for: 3600
        }
      );
      return {
        redirect: redirect.redirect_to,
        error: false
      };
    }
    throw new CandaceError(
      "400",
      "FAILED_2FA_C_LOGIN",
      "Failed to login-in using the provided user & credentials."
    );
  }
};
