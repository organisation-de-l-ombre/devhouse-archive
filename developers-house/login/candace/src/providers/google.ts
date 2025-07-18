import FormData from "form-data";
import fetch from "node-fetch";
import { ConstructorType, GeneralUser, Provider } from "./types";

export default class GoogleProvider implements Provider {
  constructor(private readonly properties: ConstructorType) {}

  async exchangeCode(code: string, host: string): Promise<string> {
    const formData = new FormData();
    formData.append("client_id", this.properties.client_id);
    formData.append("client_secret", this.properties.client_secret);
    formData.append("grant_type", "authorization_code");
    formData.append("code", code);
    formData.append(
      "redirect_uri",
      `${host}${this.properties.redirect_uri}/google`
    );

    const resp = await fetch(`https://oauth2.googleapis.com/token`, {
      body: formData,
      method: "POST",
      headers: formData.getHeaders()
    });

    if (!resp.ok) {
      throw new Error("Unable to exchange the token from google.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (await resp.json()).access_token;
  }

  getRedirectUri(state: string, host: string): string {
    const scope = "https://www.googleapis.com/auth/userinfo.profile";

    return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=${encodeURIComponent(
      scope
    )}&state=${encodeURIComponent(
      state
    )}&redirect_uri=${`${host}${this.properties.redirect_uri}/google`}&client_id=${
      this.properties.client_id
    }`;
  }

  async getUserData(token: string): Promise<GeneralUser> {
    const resp = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?oauth_token=${token}`
    );

    const user = await resp.json();
    if (!resp.ok || !user.id || !user.name) {
      throw new Error(
        `Unable to get the user from google. ${JSON.stringify(
          user,
          undefined,
          "\t"
        )}`
      );
    }
    return {
      id: user.id,
      username: user.name,
      provider: "google",
      avatarURL: user.picture
    };
  }

  meta(): { name: string; color: string } {
    return { color: "#4285F4", name: "Google" };
  }
}
