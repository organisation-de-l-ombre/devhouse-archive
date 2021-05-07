import { Session, SessionOptions } from "next-iron-session";

export function ironSession(): SessionOptions {
  return {
    cookieName: "__session",
    password: "5453454fs5d4f5s4v63s54v654d6v5s4v6s54654s6",
    cookieOptions: {
      secure: false,
    },
  };
}
declare module "http" {
  export interface IncomingMessage {
    session: Session;
  }
}
