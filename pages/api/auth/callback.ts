import { randomBytes } from "crypto";
import { NextApiHandler, NextApiRequest } from "next";
import { withSession, SessionData } from "next-session";
import { AdminAPI, validateHydraResponse } from "../../../service/hydra";
import { GeneralUser, Providers } from "../../../service/providers";

/*
 * Redirects to the requested url.
 */
const handler: NextApiHandler = async (
  req: NextApiRequest & { session: SessionData },
  res
) => {
  try {
    if (!req.session.login) throw new Error("Invalid session.");

    let {
      session: {
        login: { state: sessionState, provider, challenge },
        destroy,
      },
      query: { code, state },
      headers: { host },
    } = req;

    if (Array.isArray(code)) code = code[0];

    if (state && provider && code && challenge && sessionState) {
      if (state === sessionState) {
        const instance = Providers.get(provider);
        // Excange the token.
        const user: GeneralUser | undefined = await instance
          .exchangeCode(code, host)
          .then(instance.getUserData)
          .catch(() => {
            // Error
            return undefined;
          });
        destroy();
        if (!user) {
          throw new Error("Failed to get user from provider.");
        }

        // TODO: Call the scarlet backend.

        const data = await AdminAPI.acceptLoginRequest(challenge, {
          subject: randomBytes(25).toString("base64"),
          context: {
            betaNoAuth: true,
          },
        }).then(validateHydraResponse);

        res.redirect(data.redirect_to);
      } else {
        throw new Error("Invalid request state.");
      }
    } else {
      throw new Error("Invalid arguments for the request.");
    }
  } catch (error) {
    res.statusCode = 400;
    res.statusMessage = error.message ?? "Invalid request or invalid session.";
    res.json({
      code: res.statusCode,
      message: res.statusMessage,
    });
  }
};

export default withSession(handler);
