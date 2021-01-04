import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import * as process from "process";
import { fetchUser } from "utilities";
import { DefaultRootState } from "react-redux";
import { NotificationPayloadType } from "../notifications";
import {
  PayloadTypes,
  User,
  UserFetched,
  UserInit,
  UserTokenReceived,
} from "./index";

function makeId(length: number): string {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let clientIdPromise: Promise<void> | null = null;
let clientId: string | null = null;

async function fetchClientId() {
  const { id } = await fetch("/.oauth.json").then((r) => r.json());
  clientId = id;
  clientIdPromise = null;
}

if (process.env.NODE_ENV === "production") {
  clientIdPromise = fetchClientId();
} else {
  clientId = "b63ae62c-830d-46a9-abff-ccdf2ca6fb52";
}

async function getTokenWithPopup(): Promise<string> {
  const h = 600;
  const w = 450;

  const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
  const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;

  const options = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`;

  const state = makeId(32);

  localStorage.setItem("state-oauth", state);

  if (!clientId) {
    await clientIdPromise;
  }

  if (!clientId) throw new Error("Failed to get the client id.");

  const redirect = `${document.location.protocol}//${document.location.host}/callback`;
  const apiAudience = "website";

  const scopes = ["account:all"].join(" ");

  const popupWindow = window.open(
    `http://auth-server.developershouse.xyz/oauth2/auth?response_type=token&client_id=${encodeURIComponent(
      clientId
    )}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(
      redirect
    )}&state=${encodeURIComponent(state)}&audience=${encodeURIComponent(
      apiAudience
    )}`,
    "Login",
    options
  );

  // eslint-disable-next-line no-return-await
  return await new Promise<string>((resolve, reject): void => {
    if (popupWindow === null) {
      return reject(new Error("The window failed to open."));
    }

    const channel = new BroadcastChannel("callback");

    const listener = ({ data }: MessageEvent): void => {
      if (data.token && data.state) {
        if (data.state === state) {
          resolve(data.token);
        } else {
          reject(new Error("Invalid state!"));
        }
      } else if (data.error) {
        reject(new Error(data.error));
      }
      channel.close();
      popupWindow.close();
      return window.focus();
    };

    return channel.addEventListener("message", listener);
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
    /*
     * Popup open.
     */

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

        const user: User = await fetchUser();

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
