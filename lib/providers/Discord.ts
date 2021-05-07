import FormData from "form-data";
import fetch from "node-fetch";
import { ConstructorType, GeneralUser, Provider } from "./types";

export default class DiscordProvider implements Provider {
  constructor(private readonly props: ConstructorType) {}

  async exchangeCode(code: string, host: string): Promise<string> {
    const formData = new FormData();

    formData.append("client_id", this.props.client_id);
    formData.append("client_secret", this.props.client_secret);
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append(
      "redirect_uri",
      `https://${host}${this.props.redirect_uri}`
    );
    formData.append("scope", "identify");

    const resp = await fetch(`https://discord.com/api/oauth2/token`, {
      body: formData,
      method: "POST",
      headers: formData.getHeaders(),
    });
    if (!resp.ok) {
      throw new Error("Unable to exchange the token from discord.");
    }
    return (await resp.json()).access_token;
  }

  getRedirectUri(state: string, host: string): string {
    return `https://discord.com/api/oauth2/authorize?client_id=${
      this.props.client_id
    }&scope=identify&redirect_uri=${encodeURIComponent(
      `https://${host}${this.props.redirect_uri}`
    )}&state=${encodeURIComponent(state)}&response_type=code&prompt=none`;
  }

  async getUserData(token: string): Promise<GeneralUser> {
    const resp = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = await resp.json();
    if (!resp.ok || !user.id || !user.username) {
      throw new Error("Unable to get the user from discord.");
    }
    return {
      id: user.id,
      username: user.username,
      provider: "discord",
      avatarURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
    };
  }

  meta(): { name: string; color: string } {
    return { color: "#7289DA", name: "Discord" };
  }
}
