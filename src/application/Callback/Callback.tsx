import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import useAccount from "@hooks/useAccount";
import { useNotificationsManager } from "@hooks/useNotifications";
import { UserObject } from "@store/account/types";
import { SuspenseComponent } from "@components/modules";
import { FunctionComponent } from "@typings/FunctionComponent";
import { useClient } from "@hooks/useInternal";

interface AuthParameters {
  code: string | undefined;
  state: string | undefined;
}

interface CallbackState {
  error: boolean;
  errorMessage?: string;
  accountUsername?: string;
}

const authParameters: AuthParameters = {
  code: undefined,
  state: undefined,
};

const getItems = async (): Promise<unknown[]> => {
  return Promise.all([
    localStorage.getItem("state-oauth"),
    localStorage.getItem("redirection"),
    localStorage.getItem("code-verifier"),
  ]);
};

const urlEncodeFormData = (formData: string[][]): string => {
  let s = "";

  formData.forEach((pair) => {
    if (typeof pair[1] === "string") {
      s += `${(s ? "&" : "") + encodeURIComponent(pair[0])}=${pair[1]}`;
    }
  });

  return s;
};

const Callback: FunctionComponent<HTMLDivElement> = () => {
  const { clientID } = useClient();
  const { saveUser } = useAccount();
  const history = useHistory();
  const [callbackState, setCallbackState] = React.useState<CallbackState>({
    error: false,
  });
  const { addNotifications } = useNotificationsManager();
  const { t } = useTranslation("pages\\callback\\callback");
  const { t: tRoot } = useTranslation("root");

  const doLogin = useCallback(async () => {
    window.location.search
      .substring(1)
      .split("&")
      .forEach((hk) => {
        const temp = hk.split("=");
        const [name, value] = temp;

        authParameters[name as keyof AuthParameters] = value;
      });

    const [state, redirection, codeVerifier] = await getItems();

    if (clientID === "Inavlid client ID") {
      setCallbackState((previousState: CallbackState): CallbackState => {
        return {
          ...previousState,
          error: true,
          errorMessage: "Failed to fetch client ID",
        };
      });
      history.push((redirection as string) || "/");
    }

    const { code: authCode, state: authState } = authParameters;

    if (authCode && authState && state === authState) {
      const formEncoder = urlEncodeFormData([
        ["client_id", encodeURIComponent(clientID || "")],
        ["grant_type", encodeURIComponent("authorization_code")],
        ["code", encodeURIComponent(authCode)],
        [
          "redirect_uri",
          encodeURIComponent(
            `${document.location.protocol}//${document.location.host}/callback`
          ),
        ],
        ["code_verifier", codeVerifier as string],
      ]);

      try {
        const { access_token: token } = await fetch(
          "https://auth-server.developershouse.xyz/oauth2/token",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            body: formEncoder,
          }
        ).then(
          (response: Response): Promise<{ access_token: string }> =>
            response.json()
        );

        try {
          const userData = await fetch(
            "https://auth-server.developershouse.xyz/userinfo",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ).then((response: Response): Promise<UserObject> => response.json());

          saveUser({ ...userData, token });
          setCallbackState((previousState: CallbackState): CallbackState => {
            return { ...previousState, accountUsername: userData.username };
          });
        } catch (error) {
          setCallbackState((previousState: CallbackState): CallbackState => {
            return {
              ...previousState,
              error: true,
              errorMessage: (error as Error).message,
            };
          });
        }
      } catch (error) {
        setCallbackState((previousState: CallbackState): CallbackState => {
          return {
            ...previousState,
            error: true,
            errorMessage: (error as Error).message,
          };
        });
      }
    }

    history.push((redirection as string) || "/");
    localStorage.removeItem("state-oauth");
    localStorage.removeItem("redirection");
    localStorage.removeItem("code-verifier");
  }, [clientID, history, saveUser]);

  useEffect(() => {
    doLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): (() => void) => {
    return (): void => {
      if (callbackState.error && callbackState.errorMessage) {
        addNotifications([
          {
            type: "error",
            body: t("error", { error: callbackState.errorMessage }),
            time: 5000,
          },
        ]);

        return;
      }
      if (callbackState.accountUsername) {
        addNotifications([
          {
            type: "info",
            body: t("userLoggedIn", {
              username: callbackState.accountUsername,
            }),
            time: 5000,
          },
        ]);
      }
    };
  });

  return <SuspenseComponent customText={tRoot("utils.redirecting")} />;
};

export default Callback;
