import { randomBytes } from "crypto";

let clientIDPromise: Promise<void> | null = null;
let clientID: string | null = null;

const fetchClientID = async () => {
  const { id } = await fetch("/.oauth.json").then((r) => r.json());
  clientID = id;
  clientIDPromise = null;
};

if (process.env.NODE_ENV === "development") {
  clientID = "8dc341e3-06f1-4b83-9dda-18f139e55dc8";
} else {
  clientIDPromise = fetchClientID();
}

const manageAuth = async (): Promise<void> => {
  const state = randomBytes(32).toString("hex");

  localStorage.setItem("state-oauth", state);
  localStorage.setItem("redirection", document.location.pathname);

  if (clientIDPromise !== null) {
    await clientIDPromise;
  }
  if (!clientID) {
    throw new Error("Failed to get the client ID.");
  }

  const scopes = ["account.info", "account.authorized.*"];
  const audience = "imr abdera";

  document.location.href = `http://auth-server.developershouse.xyz/oauth2/auth?response_type=token&client_id=${encodeURIComponent(
    clientID
  )}&scope=${encodeURIComponent(
    scopes.join(" ")
  )}&redirect_uri=${encodeURIComponent(
    `${document.location.protocol}//${document.location.host}/callback`
  )}&state=${encodeURIComponent(state)}&audience=${encodeURIComponent(
    audience
  )}`;
};
const getAvatar = (path: string): string =>
  `https://s3.developershouse.xyz/${path}`;

export { manageAuth, getAvatar };
