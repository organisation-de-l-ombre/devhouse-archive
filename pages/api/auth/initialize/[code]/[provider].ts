import { randomBytes } from 'crypto';
import { NextApiHandler, NextApiRequest } from 'next'
import { withSession, applySession, SessionData } from 'next-session';
import { Providers } from '../../../../../providers'

/*
 * Redirects to the requested url.
 */
const handler: NextApiHandler = async (req: NextApiRequest & { session: SessionData }, res) => {
  let {
      query: { provider, code: challenge },
  } = req;

  if (!provider || !challenge)
  {
    res.statusCode = 400;
    res.statusMessage = 'Invalid code in request.';
    res.json({
        code: res.statusCode,
        message: res.statusMessage,
    });
    return;
  }

  if (Array.isArray(provider))
    provider = provider[0];

  if (Providers.has(provider)) {
    const state = randomBytes(255).toString('base64');
    // Save the session.
    await applySession(req, res);
    
    req.session.login = {
        state,
        provider,
        challenge,
    };

    const instance = Providers.get(provider);
    res.redirect(instance.getRedirectUri(state, req.headers.host));
    return;
  }

  res.statusCode = 400;
  res.statusMessage = 'Failed to get the provider.';
  res.json({
        code: res.statusCode,
        message: res.statusMessage,
  });
};

export default withSession(handler);