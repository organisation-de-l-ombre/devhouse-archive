import Tokens from "csrf";
import { IncomingMessage, ServerResponse } from "http";
import { applySession, SessionData } from "next-session";

const tokenProvider = new Tokens({});

export function create(secret: string) {
  return tokenProvider.create(secret);
}

export async function createSession() {
  return tokenProvider.secret();
}

export function check(secret: string, token: string) {
  return tokenProvider.verify(secret, token);
}

export async function provide(
  req: IncomingMessage & { session: SessionData },
  res: ServerResponse
) {
  if (!req.session.csrf) {
    await applySession(req, res);
    req.session.csrf = await createSession();
  }
  return create(req.session.csrf);
}
