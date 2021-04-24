import { SessionData } from "next-session";
import { GeneralUser } from "./service/providers";

interface LoginSession {
  state: string;
  provider: string;
  loginChallenge: string;
}

interface RegisterSession {
  user: GeneralUser;
  loginChallenge: string;
}

interface ConsentSession {
  consentChallenge: string;
  scopes: string[];
  audiences: string[];
  user: object;
}

interface LogoutSession {
  logoutChallenge: string;
}

export default interface Session extends SessionData {
  csrfKey: string;
  login?: LoginSession;
  register?: RegisterSession;
  consent?: ConsentSession;
  logout?: LogoutSession;
}

declare module "http" {
  export interface IncomingMessage {
    session: Session;
  }
}
