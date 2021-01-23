import React from "react";
import requestParameters from "./QueriesSelector";
import useUser from "../../hooks/User";

const Callback = (): React.ReactElement => {
  const { saveUser } = useUser();

  React.useEffect(() => {
    if (requestParameters.access_token && requestParameters.state) {
      if (localStorage.getItem("state-oauth") === requestParameters.state) {
        localStorage.removeItem("state-oauth");

        const redirection = localStorage.getItem("redirection");
        localStorage.removeItem("redirection");

        fetch("https://auth-server.developershouse.xyz/userinfo", {
          headers: {
            Authorization: `Bearer ${requestParameters.access_token}`,
          },
        })
          .then((response) => response.json())
          .then((response) => {
            saveUser({ ...response, token: requestParameters.access_token });

            document.location.href = `${document.location.protocol}//${
              document.location.host
            }${redirection || "/"}`;
          });
      }
    }
  }, [saveUser]);

  return <></>;
};

export default Callback;
