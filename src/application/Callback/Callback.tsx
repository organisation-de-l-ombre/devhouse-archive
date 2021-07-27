import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import { useNotificationsManager } from "@hooks/useNotifications";
import { SuspenseComponent } from "@components/modules";
import { FunctionComponent } from "@typings/FunctionComponent";
import { useClient } from "@hooks/useInternal";
import { useDispatch } from "react-redux";
import { createUser, setTokens } from "@store/account/actions";
import { User } from "@store/account/types";

interface AuthParameters {
  code: string | undefined;
  state: string | undefined;
}

const urlEncodeFormData = (formData: { [key: string]: string }): string => {
  let s = "";

  Object.keys(formData).forEach((key) => {
    if (typeof formData[key] === "string") {
      s += `${(s ? "&" : "") + encodeURIComponent(key)}=${formData[key]}`;
    }
  });

  return s;
};

const Callback: FunctionComponent<HTMLDivElement> = () => {
  const clientId = useClient();
  const history = useHistory();
  const { addNotifications } = useNotificationsManager();
  const dispatch = useDispatch();
  const { t } = useTranslation("pages\\callback\\callback");
  const { t: tRoot } = useTranslation("root");

  const doLogin = useCallback(async () => {
    const redirection = localStorage.getItem("redirection");

    if (!clientId) {
      history.push((redirection as string) || "/");
      return;
    }

    const parameters: Partial<AuthParameters> = {};
    window.location.search
      .substring(1)
      .split("&")
      .forEach((hk) => {
        const [name, value] = hk.split("=") as [keyof AuthParameters, string];
        parameters[name] = decodeURIComponent(value);
      });

    const authState = localStorage.getItem("state-oauth");
    const codeVerifier = localStorage.getItem("code-verifier");

    const { code: authCode, state } = parameters;

    if (!authCode || !authState || state !== authState || !codeVerifier) {
      // incomplete session.
      history.push((redirection as string) || "/");
      return;
    }

    const formData = urlEncodeFormData({
      client_id: encodeURIComponent(clientId),
      grant_type: encodeURIComponent("authorization_code"),
      code: encodeURIComponent(authCode),
      redirect_uri: encodeURIComponent(
        `${document.location.protocol}//${document.location.host}/callback`
      ),
      code_verifier: codeVerifier,
    });

    const tokens: {
      refresh_token: string;
      access_token: string;
      id_token: string;
      expire: number;
    } = await fetch("https://auth-server.developershouse.xyz/oauth2/token", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body: formData,
    })
      .then((x) => x.json())
      .catch(() => null);

    if (!tokens) {
      addNotifications([
        {
          type: "error",
          body: t("error", {
            error: "Failed to exchange the authorization token.",
          }),
          time: 5000,
        },
      ]);

      history.push((redirection as string) || "/");
      return;
    }
    const {
      id_token: idToken,
      access_token: accessToken,
      refresh_token: refreshToken,
      expire,
    } = tokens;
    const expireDate = new Date();
    expireDate.setSeconds(expireDate.getSeconds() + expire);
    dispatch(setTokens({ accessToken, refreshToken, expire: expireDate }));
    // minimal parser for jwt tokens.
    const user: User | null = JSON.parse(atob(idToken.split(".")[1]));

    if (!user) {
      addNotifications([
        {
          type: "error",
          body: t("error", {
            error: "Failed to access your account information",
          }),
          time: 5000,
        },
      ]);

      history.push((redirection as string) || "/");
      return;
    }

    dispatch(createUser(user));

    addNotifications([
      {
        type: "info",
        body: t("userLoggedIn", {
          username: user.username,
        }),
        time: 5000,
      },
    ]);

    localStorage.removeItem("state-oauth");
    localStorage.removeItem("redirection");
    localStorage.removeItem("code-verifier");
    history.push((redirection as string) || "/");
  }, [clientId, history, dispatch, addNotifications, t]);

  useEffect(() => {
    doLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <SuspenseComponent customText={tRoot("utils.redirecting")} />;
};

export default Callback;
