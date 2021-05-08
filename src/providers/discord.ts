import FormData from "form-data";
import fetch from "node-fetch";
import { ConstructorType, GeneralUser, Provider } from "./types";

export default class DiscordProvider implements Provider {
  constructor(private readonly properties: ConstructorType) {}

  async exchangeCode(code: string, host: string): Promise<string> {
    const formData = new FormData();

    formData.append("client_id", this.properties.client_id);
    formData.append("client_secret", this.properties.client_secret);
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append(
      "redirect_uri",
      `${host}${this.properties.redirect_uri}/discord`
    );
    formData.append("scope", "identify");

    const resp = await fetch(`https://discord.com/api/oauth2/token`, {
      body: formData,
      method: "POST",
      headers: formData.getHeaders()
    });
    if (!resp.ok) {
      console.log(await resp.json());
      throw new Error("Unable to exchange the token from discord.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (await resp.json()).access_token;
  }

  getRedirectUri(state: string, host: string): string {
    return `https://discord.com/api/oauth2/authorize?client_id=${
      this.properties.client_id
    }&scope=identify&redirect_uri=${encodeURIComponent(
      `${host}${this.properties.redirect_uri}/discord`
    )}&state=${encodeURIComponent(state)}&response_type=code&prompt=none`;
  }

  async getUserData(token: string): Promise<GeneralUser> {
    const resp = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const user: Record<string, string> = await resp.json();
    if (!resp.ok || !user.id || !user.username) {
      throw new Error("Unable to get the user from discord.");
    }
    return {
      id: user.id,
      username: user.username,
      provider: "discord",
      avatarURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    };
  }

  meta(): { name: string; color: string } {
    return { color: "#7289DA", name: "Discord" };
  }
}
