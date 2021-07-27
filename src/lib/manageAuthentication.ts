import times from "lodash.times";

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

const manageAuth = async (clientId: string | null): Promise<void> => {
  const state = randomString(32);

  localStorage.setItem("state-oauth", state);

  if (!clientId) {
    throw new Error("Failed to fetch client ID.");
  }

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

export default manageAuth;
