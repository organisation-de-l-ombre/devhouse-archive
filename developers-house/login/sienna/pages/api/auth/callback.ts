import { NextApiHandler, NextApiRequest } from "next";
import {applySession, withSession} from "next-session";
import {GeneralUser, Providers} from "../../../lib/service/providers";
import {AdminAPI, validateHydraResponse} from "../../../lib/service/hydra";
import {options} from "../../../lib/service/session";

/*
 * Redirects to the requested url.
 */
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res
) => {
  if (!req.session.login) throw new Error("Invalid session.");
  // Unpack all the data.
  let {
    session: {
      login: { state: sessionState, provider, loginChallenge },
      destroy,
    },
    query: { code, state },
    headers: { host },
  } = req;
  // Fix for the typescript.
  if (Array.isArray(code)) code = code[0];
  // We need all of theses arguments.
  if (state && provider && code && loginChallenge && sessionState) {
    // We check if the oauth state matches.
    if (state === sessionState) {
      // Gets the provider instance.
      const instance = Providers.get(provider);
      // Exchange the token.
      const user: GeneralUser | undefined = await instance
        .exchangeCode(code, host)
        .then(instance.getUserData)
        .catch(() => {
          // Error
          return undefined;
        });
      // Destroy the session.
      await destroy();
      // If there is no user.
      if (!user) {
        throw new Error("Failed to get user from provider.");
      }

      // Note: This calls the scarlet service who handles the database.

      const requestBody = {
        platform: provider,
        platformId: user.id,
      };

      const result = await fetch(`${process.env.SCARLET_ENDPOINT}/api/users/login`, {
        body: JSON.stringify(requestBody),
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result.ok) {
        const { status, user: userData } = await result.json();

        switch (status) {
          case 'NO_USER':
          {
            await applySession(req as any, res, options);
            req.session.register = {
              loginChallenge,
              user,
            };
            res.redirect(`/dialog/register`);
            return;
          }
          case 'FLOW_VALIDATED':
          {
            const data = await AdminAPI.acceptLoginRequest(loginChallenge, {
              subject: userData.uuid,
              remember: true,
              remember_for: 3600 * 24,
            }).then(validateHydraResponse);
            res.redirect(data.redirect_to);
            return;
          }
          case '2FA_REQUIRED_VERIFY':
          {
            // TODO: 2FA redirect & session.
            return;
          }
        }
      }
      throw new Error("Scarlet call failed.");
    }
    throw new Error("Invalid request state.");
  }
  throw new Error("Invalid arguments for the request.");
};

export default withSession(handler, options);
