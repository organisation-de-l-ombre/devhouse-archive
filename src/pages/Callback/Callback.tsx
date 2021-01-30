import React from "react";
import localForage from "localforage";
import requestParameters from "./QueriesSelector";
import useUser from "../../hooks/User";

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
  const doLogin = React.useCallback(async () => {
    const [state, redirection, clientID, codeVerifier] = await getLocalForage();

    if (requestParameters.code && requestParameters.state) {
      if (state === requestParameters.state) {
        await localForage.removeItem("state-oauth");

        const redirectionPath = redirection;
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
        ).then((res) => res.json());

        fetch("https://auth-server.developershouse.xyz/userinfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((response) => {
            saveUser({ ...response, token });

            document.location.href = `${document.location.protocol}//${
              document.location.host
            }${redirectionPath || "/"}`;
          });
      }
    }
  }, [saveUser]);

  React.useEffect(() => {
    doLogin();
  }, [doLogin]);
  return <></>;
};

export default Callback;
