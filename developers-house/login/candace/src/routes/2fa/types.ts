import { LoginWithPlatform, User } from "@developers-house/scarlet";

export interface TwoFASession {
  challenge: string;
  user: User;
  webauthChallenge?: string;
  login: LoginWithPlatform;
}
