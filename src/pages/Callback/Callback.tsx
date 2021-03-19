import React from "react";
import localForage from "localforage";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import generateNotificationID from "../../utilities/generateNotificationID";
import requestParameters from "./QueriesSelector";
import useUser from "../../hooks/User";
import i18n from "../../languages/i18n";
import { pushNotifications } from "../../store/notifications/Actions";

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
  const dispatch = useDispatch();

  const doLogin = React.useCallback(async () => {
    const [state, redirection, clientID, codeVerifier] = await getLocalForage();
    const redirectionPath = redirection;

    if (requestParameters.code && requestParameters.state) {
      if (state === requestParameters.state) {
        await localForage.removeItem("state-oauth");
        await localForage.removeItem("redirection");
        await new Promise(
          // eslint-disable-next-line no-async-promise-executor
          async (): Promise<void> => {
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
            ).then((res) => res.json());

            const data = await fetch(
              "https://auth-server.developershouse.xyz/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ).then((response) => response.json());

            saveUser({ ...data, token });
            dispatch(
              pushNotifications([
                {
                  id: generateNotificationID(),
                  type: "info",
                  time: 5000,
                  body: i18n.t("pages\\callback\\authentication:success", {
                    username: data.username,
                  }),
                },
              ])
            );
          }
        ).catch((): void => {
          dispatch(
            pushNotifications([
              {
                id: generateNotificationID(),
                type: "info",
                time: 5000,
                body: i18n.t("pages\\callback\\authentication:failed"),
              },
            ])
          );
        });
      }
    }

    history.push((redirectionPath as string) || "");
  }, [history, saveUser, dispatch]);

  React.useEffect(() => {
    doLogin();
  }, [doLogin]);

  return <></>;
};

export default Callback;
