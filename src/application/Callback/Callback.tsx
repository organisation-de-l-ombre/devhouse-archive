import React from "react";
import localForage from "localforage";
import { useHistory } from "react-router";
import requestParameters from "./QueriesSelector";
import useUser from "../../hooks/User/User";
import { useNotificationsManager } from "../../hooks/Notifications/Notifications";
import generateNotificationID from "../../utilities/generateNotificationID";
import { ErrorState } from "./Types";

const getLocalForage = async () => {
  return Promise.all([
    localForage.getItem("state-oauth"),
    localForage.getItem("redirection"),
    localForage.getItem("client-id"),
    localForage.getItem("code-verifier"),
  ]);
};
const urlEncodeFormData = (fd: string[][]) => {
  let s = "";
  fd.forEach((pair) => {
    if (typeof pair[1] === "string") {
      s += `${(s ? "&" : "") + encodeURIComponent(pair[0])}=${pair[1]}`;
    }
  });
  return s;
};
const Callback = (): React.ReactElement => {
  const { saveUser } = useUser();
  const history = useHistory();
  const [errorState, setErrorState] = React.useState<ErrorState>({
    error: false,
  });
  const { addNotifications } = useNotificationsManager();

  const doLogin = React.useCallback(async () => {
    const [state, redirection, clientID, codeVerifier] = await getLocalForage();
    const redirectionPath = redirection;

    if (requestParameters.code && requestParameters.state) {
      if (state === requestParameters.state) {
        await localForage.removeItem("state-oauth");
        await localForage.removeItem("redirection");

        const formEncoder = urlEncodeFormData([
          ["client_id", encodeURIComponent((clientID as string) || "")],
          ["grant_type", encodeURIComponent("authorization_code")],
          ["code", encodeURIComponent(requestParameters.code)],
          [
            "redirect_uri",
            encodeURIComponent(
              `${document.location.protocol}//${document.location.host}/callback`
            ),
          ],
          ["code_verifier", codeVerifier as string],
        ]);
        const { access_token: token } = await fetch(
          "https://auth-server.developershouse.xyz/oauth2/token",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            body: formEncoder,
          }
        )
          .then((res) => res.json())
          .catch(() => setErrorState({ error: true }));

        const data = await fetch(
          "https://auth-server.developershouse.xyz/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => response.json())
          .catch(() => setErrorState({ error: true }));

        saveUser({ ...data, token });
        setErrorState(
          (previousState: ErrorState): ErrorState => {
            return { ...previousState, username: data.username };
          }
        );
      }
    }

    history.push((redirectionPath as string) || "");
  }, [history, saveUser]);

  React.useEffect(() => {
    doLogin();
  }, [doLogin]);

  React.useEffect((): (() => void) => {
    return (): void => {
      switch (errorState.error) {
        case true:
          addNotifications([
            {
              id: generateNotificationID(),
              type: "error",
              body:
                "Une erreur est survenue durant la connexion. Veuillez réessayer.",
              time: 5000,
            },
          ]);
          break;

        case false:
          if (errorState.username) {
            addNotifications([
              {
                id: generateNotificationID(),
                type: "info",
                body: `Vous êtes connecté en tant que ${errorState.username}.`,
                time: 5000,
              },
            ]);
          }
          break;

        default:
          break;
      }
    };
  });

  return <></>;
};

export default Callback;
