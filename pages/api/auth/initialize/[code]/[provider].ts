import { randomBytes } from "crypto";
import { NextApiHandler, NextApiRequest } from "next";
import { withSession, applySession } from "next-session";
import { options } from "../../../../../lib/service/session";
import { Providers } from "../../../../../lib/service/providers";

/*
 * Redirects to the requested url.
 */
const handler: NextApiHandler = async (req: NextApiRequest, res) => {
  let {
    query: { provider, code: challenge },
  } = req;

  if (!provider || !challenge) {
    throw new Error("Missing challenge or provider.");
  }

  if (Array.isArray(provider)) provider = provider[0];
  if (Array.isArray(challenge)) challenge = challenge[0];

  if (Providers.has(provider)) {
    // Generate the state for the oauth flow.
    const state = randomBytes(255).toString("base64");
    // Save the session.
    await applySession(req as any, res, options);
    // Apply the changes to the session.
    req.session.login = {
      state,
      provider,
      loginChallenge: challenge,
    };
    // Gets the given provider.
    const instance = Providers.get(provider);
    res.redirect(instance.getRedirectUri(state, req.headers.host));
    return;
  }

  throw new Error("Failed to get the provider.");
};

export default withSession(handler, options);
