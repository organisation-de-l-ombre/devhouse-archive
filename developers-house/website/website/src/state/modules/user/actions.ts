import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { fetchUser, urlEncodeFormData } from "utilities";
import { DefaultRootState } from "react-redux";
import { randomBytes } from "crypto";
import { NotificationPayloadType } from "../notifications/Types";
import {
  PayloadTypes,
  User,
  UserFetched,
  UserInit,
  UserTokenReceived,
} from "./index";

let clientId: string | null = null;

const DEV_CLIENT_ID = "4f48003e-3e66-40c4-b2b7-a0516dc40d4a";
async function fetchClientId(): Promise<string> {
  if (process.env.NODE_ENV === "development") return DEV_CLIENT_ID;
  const { id } = await fetch("/.oauth.json").then((r) => r.json());
  return id;
}

fetchClientId().then((cid) => {
  clientId = cid;
});

export function getClientId(): string | null {
  return clientId;
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

function getTokenWithPopup() {
  const h = 600;
  const w = 450;

  const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
  const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
  const options = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`;

  return new Promise<string>((accept, reject) => {
    const state = randomBytes(32).toString("hex");
    const codeVerifier = encodeURIComponent(randomBytes(32).toString("hex"));
    generateCodeChallenge(codeVerifier).then((codeChallenge): void => {
      if (!clientId) return reject(new Error("ClientId not loaded"));
      const redirect = `${document.location.protocol}//${document.location.host}/callback`;
      const apiAudience = "abdera";
      const scopes = ["account.* websocket.*"].join(" ");

      const url = `http://auth-server.developershouse.xyz/oauth2/auth?response_type=code&client_id=${encodeURIComponent(
        clientId
      )}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(
        redirect
      )}&state=${encodeURIComponent(state)}&audience=${encodeURIComponent(
        apiAudience
      )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
      const popupWindow = window.open(url, "Login", options);

      if (!popupWindow)
        return reject(new Error("Can't open the window popup."));

      const channel = new BroadcastChannel("callback");

      const listener = async ({ data }: MessageEvent): Promise<void> => {
        if (data.code && data.state && data.state === state) {
          const formEncoder = urlEncodeFormData([
            ["client_id", encodeURIComponent(clientId || "")],
            ["grant_type", encodeURIComponent("authorization_code")],
            ["code", encodeURIComponent(data.code)],
            ["redirect_uri", encodeURIComponent(redirect)],
            ["code_verifier", codeVerifier],
          ]);
          fetch("https://auth-server.developershouse.xyz/oauth2/token", {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            body: formEncoder,
          })
            .then((resp) => resp.json())
            .then((response) => {
              accept(response.access_token);
            })
            .catch(reject);
        } else {
          reject(new Error("Invalid state!"));
        }
        channel.close();
        popupWindow.close();
        return window.focus();
      };

      return channel.addEventListener("message", listener);
    });
  });
}

export function loginUser(): ThunkAction<
  void,
  DefaultRootState,
  PayloadTypes | NotificationPayloadType,
  Action<(PayloadTypes | NotificationPayloadType)["type"]>
> {
  return async (dispatch): Promise<void> => {
    dispatch({
      type: UserInit,
    });

    dispatch({
      type: "NOTIFICATION_PUSH",
      notification: {
        text: "Please, log-in using the authentication popup.",
        time: 5000,
        level: "info",
      },
    });

    await getTokenWithPopup()
      .then(async (token) => {
        dispatch({
          type: UserTokenReceived,
          token,
        });

        const user: User = await fetchUser(token);

        dispatch({
          type: UserFetched,
          user,
        });

        dispatch({
          type: "NOTIFICATION_PUSH",
          notification: {
            text: `Welcome ${user.username}`,
            time: 2000,
            level: "info",
          },
        });
      })
      .catch(() => {
        dispatch({
          type: "NOTIFICATION_PUSH",
          notification: {
            text:
              "Failed to log-in using the popup. Please try contact our support by joining our discord server.",
            time: 10000,
            level: "info",
          },
        });
      });
  };
}

export function logoutUser(): ThunkAction<
  void,
  DefaultRootState,
  PayloadTypes | NotificationPayloadType,
  Action<(PayloadTypes | NotificationPayloadType)["type"]>
> {
  return async (dispatch): Promise<void> => {
    dispatch({
      type: "USER_LOGOUT",
    });

    dispatch({
      type: "NOTIFICATION_PUSH",
      notification: {
        text: "Successfully logged out",
        level: "info",
        time: 1000,
      },
    });
  };
}
