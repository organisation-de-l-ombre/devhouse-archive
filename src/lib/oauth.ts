import { Tokens, User } from "@store/account/types";
import times from "lodash.times";

const urlEncodeFormData = (formData: { [key: string]: string }): string => {
  let s = "";

  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === "string") {
      s += `${(s ? "&" : "") + encodeURIComponent(key)}=${formData[key]}`;
    }
  });

  return s;
};

const randomString = (randomBytesLength = 48): string => {
  if (typeof window === "undefined") {
    return "";
  }

  // 9 * 4/3 = 12
  // this is to avoid getting padding of a random byte string when it is base64 encoded
  let randomBytes: Uint8Array | number[];

  if (window.crypto && window.crypto.getRandomValues) {
    randomBytes = new Uint8Array(randomBytesLength);
    window.crypto.getRandomValues(randomBytes);
  } else {
    randomBytes = times(randomBytesLength, () =>
      Math.floor(Math.random() * 256)
    );
  }

  return window
    .btoa(String.fromCharCode(...randomBytes))
    .replace(/=/g, "")
    .replaceAll("+", "-")
    .replaceAll("/", "_");
};

const generateCodeChallenge = async (code: string): Promise<string> => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(code)
  );

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const redirectToLogin = async (clientId: string): Promise<void> => {
  const state = randomString(32);
  localStorage.setItem("state-oauth", state);

  const scopes = ["account.info", "account.authorized.*", "offline", "openid"];
  const audience = "imr abdera";
  const codeVerifier = randomString(32);

  localStorage.setItem("code-verifier", codeVerifier);

  const codeChallenge = await generateCodeChallenge(codeVerifier);

  document.location.href = `https://auth-server.developershouse.xyz/oauth2/auth?response_type=code&client_id=${encodeURIComponent(
    clientId
  )}&scope=${encodeURIComponent(
    scopes.join(" ")
  )}&redirect_uri=${encodeURIComponent(
    `${document.location.protocol}//${document.location.host}/callback`
  )}&state=${encodeURIComponent(state)}&audience=${encodeURIComponent(
    audience
  )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
};

const refresh = (
  clientId: string,
  refreshToken: string
): Promise<Tokens & { idToken: string }> => {
  const encoded = urlEncodeFormData({
    client_id: encodeURIComponent(clientId),
    grant_type: encodeURIComponent("refresh_token"),
    refresh_token: refreshToken,
  });

  return fetch("", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
    body: encoded,
  })
    .then((response) => response.json())
    .then((response): Tokens & { idToken: string } => ({
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expire: response.expires_in,
      idToken: response.id_token,
    }));
};

const getUser = (idToken: string): User => {
  return JSON.parse(atob(idToken.split(".")[1]));
};
export { redirectToLogin, refresh, urlEncodeFormData, getUser };
