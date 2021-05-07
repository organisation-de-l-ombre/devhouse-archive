/*
 * The list of oauth proviers.
 */

import { ConstructorType, Provider } from "./types";

import DiscordProvider from "./Discord";
import GitHubProvider from "./GitHub";
import GoogleProvider from "./Google";

export const Providers = new Map<string, Provider>();

interface Constructeable {
  new (options: ConstructorType): Provider;
}

// eslint-disable-next-line @typescript-eslint/no-shadow
const addProvider = (name: string, Provider: Constructeable) => {
  if (
    process.env[`${name.toUpperCase()}_SECRET`] &&
    process.env[`${name.toUpperCase()}_CLIENT_ID`]
  ) {
    Providers.set(
      name,
      new Provider({
        client_id: process.env[`${name.toUpperCase()}_CLIENT_ID`] as string,
        redirect_uri: "/dialog/api/auth/callback",
        client_secret: process.env[`${name.toUpperCase()}_SECRET`] as string,
      })
    );
  }
};

addProvider("discord", DiscordProvider);
addProvider("google", GoogleProvider);
addProvider("github", GitHubProvider);
