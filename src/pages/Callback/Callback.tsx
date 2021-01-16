import React from "react";
import { useDispatch } from "react-redux";
import requestParameters from "./QueriesSelector";
import { createUser } from "../../store/user/Actions";

const Callback = (): React.ReactElement => {
  const dispatch = useDispatch();

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
            dispatch(
              createUser({ ...response, token: requestParameters.access_token })
            );

            document.location.href = `${document.location.protocol}//${
              document.location.host
            }${redirection || "/"}`;
          });
      }
    }
  }, [dispatch]);

  return <></>;
};

export default Callback;
