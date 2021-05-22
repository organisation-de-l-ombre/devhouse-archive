import { randomBytes } from "crypto";
import localForage from "localforage";
import getApplicationID from "./getApplicationID";

const clientID: string = getApplicationID();
const generateCodeChallenge = async (code: string): Promise<string> => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(code)
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const manageAuth = async (): Promise<void> => {
  const state = randomBytes(32).toString("hex");

  await localForage.setItem("state-oauth", state);

  if (!clientID) {
    throw new Error("Failed to get the client ID.");
  }

  const scopes = ["account.info", "account.authorized.*"];
  const audience = "imr abdera";
  const codeVerifier = randomBytes(32).toString("hex");

  await localForage.setItem("code-verifier", codeVerifier);

  const codeChallenge = await generateCodeChallenge(codeVerifier);

  document.location.href = `https://auth-server.developershouse.xyz/oauth2/auth?response_type=code&client_id=${encodeURIComponent(
    clientID as string
  )}&scope=${encodeURIComponent(
    scopes.join(" ")
  )}&redirect_uri=${encodeURIComponent(
    `${document.location.protocol}//${document.location.host}/callback`
  )}&state=${encodeURIComponent(state)}&audience=${encodeURIComponent(
    audience
  )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
};
const getAvatar = (path: string): string =>
  `https://s3.developershouse.xyz/${path}`;

export { manageAuth, getAvatar };
