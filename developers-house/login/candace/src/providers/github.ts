import FormData from "form-data";
import fetch from "node-fetch";
import { ConstructorType, GeneralUser, Provider } from "./types";

export default class GitHubProvider implements Provider {
  constructor(private readonly properties: ConstructorType) {}

  async exchangeCode(code: string, host: string): Promise<string> {
    const formData = new FormData();

    formData.append("client_id", this.properties.client_id);
    formData.append("client_secret", this.properties.client_secret);
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append(
      "redirect_uri",
      `${host}${this.properties.redirect_uri}/github`
    );
    formData.append("scope", "identify");

    const resp = await fetch(`https://github.com/login/oauth/access_token`, {
      body: formData,
      method: "POST",
      headers: {
        Accept: "application/json"
      }
    });
    if (!resp.ok) {
      throw new Error("Unable to exchange the token from github.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (await resp.json()).access_token;
  }

  getRedirectUri(state: string, host: string): string {
    return `https://github.com/login/oauth/authorize?client_id=${
      this.properties.client_id
    }&scope=read_user&redirect_uri=${encodeURIComponent(
      `${host}${this.properties.redirect_uri}/github`
    )}&state=${encodeURIComponent(state)}&response_type=code&prompt=none`;
  }

  async getUserData(token: string): Promise<GeneralUser> {
    const resp = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`
      }
    });
    const user = await resp.json();
    if (!resp.ok || !user.id || !user.login) {
      throw new Error("Unable to get the user from github.");
    }
    return {
      id: user.id,
      username: user.login.toString(),
      provider: "github",
      avatarURL: user.avatar_url
    };
  }

  meta(): { name: string; color: string } {
    return { color: "#222222", name: "GitHub" };
  }
}
