import { randomBytes } from "crypto";
import { urlEncodeFormData } from "../../../utilities";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
/**
 * Fetches the application id linked to the application.
 */
export async function fetchClient(): Promise<string> {
  if (process.env.NODE_ENV === "production") {
    const { id } = await fetch("/.oauth.json").then((r) => r.json());
    return id;
  }
  await sleep(5000);
  return "4f48003e-3e66-40c4-b2b7-a0516dc40d4a";
}
async function centeredPopup(url: string): Promise<Window> {
  const h = 600;
  const w = 450;

  const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
  const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
  const options = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`;
  const popup = window.open(url, undefined, options);
  if (!popup)
    throw new Error(
      "Failed to open the popup. You may need to disable your popup blocker."
    );
  return popup;
}
function randomHex() {
  return randomBytes(32).toString("hex");
}
async function generateCodeChallenge(codeVerifier: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier)
  );

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
function getURL(
  clientId: string,
  scopes: string[],
  redirect: string,
  state: string,
  apiAudience: string,
  codeChallenge: string
) {
  return `https://auth-server.developershouse.xyz/oauth2/auth?response_type=code&client_id=${encodeURIComponent(
    clientId
  )}&scope=${encodeURIComponent(
    scopes.join(" ")
  )}&redirect_uri=${encodeURIComponent(redirect)}&state=${encodeURIComponent(
    state
  )}&audience=${encodeURIComponent(
    apiAudience
  )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
}
export async function retrieveOauthToken(clientId: string): Promise<string> {
  const state = randomHex();
  const verifier = encodeURIComponent(randomHex());
  const challenge = await generateCodeChallenge(verifier);
  const scopes = ["account.*", "websocket.*"];
  const audiences = "abdera";
  const redirect = `${document.location.protocol}//${document.location.host}/callback`;
  const popup = await centeredPopup(
    getURL(clientId, scopes, redirect, state, audiences, challenge)
  );
  const channel = new BroadcastChannel("callback");
  return new Promise((resolve, reject) => {
    let timer: NodeJS.Timeout;
    function cancel() {
      if (!popup.closed) popup.close();
      clearInterval(timer);
      channel.close();
      reject(new Error("The window was closed or the operation was canceled."));
    }
    timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        cancel();
      }
    }, 100);
    const timeout = setTimeout(cancel, 60 * 1000);

    async function listener({ data, isTrusted }: MessageEvent): Promise<void> {
      if (isTrusted && data.code && data.state && data.state === state) {
        const form = urlEncodeFormData([
          ["client_id", encodeURIComponent(clientId || "")],
          ["grant_type", encodeURIComponent("authorization_code")],
          ["code", encodeURIComponent(data.code)],
          ["redirect_uri", encodeURIComponent(redirect)],
          ["code_verifier", verifier],
        ]);
        const response = await fetch(
          "https://auth-server.developershouse.xyz/oauth2/token",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            body: form,
          }
        ).catch(reject);
        if (response) {
          const { access_token: token } = await response.json();
          popup.removeEventListener("close", cancel);
          popup.close();
          clearTimeout(timeout);
          channel.close();
          resolve(token);
        }
      }
    }
    channel.addEventListener("message", listener);
  });
}
