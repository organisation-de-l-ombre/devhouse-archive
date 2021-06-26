import React, { ReactElement, useEffect, useState } from "react";
import { withGate } from "@components/FeatureGate/FeatureGateProvider";
import { Loader } from "../../components/SuspenseLoader/SuspenseLoader";

function parseQuery(queryString: string) {
  const query: { [key: string]: string } = {};
  const pairs = (
    queryString[0] === "?" ? queryString.substr(1) : queryString
  ).split("&");
  for (let i = 0; i < pairs.length; i += 1) {
    const pair = pairs[i].split("=");
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
  }
  return query;
}
const Callback = (): ReactElement => {
  const [message, setMessage] = useState<string>();
  useEffect(() => {
    const params = parseQuery(document.location.search);
    if (params.code && params.state) {
      const channel = new BroadcastChannel("callback");
      channel.postMessage({
        code: params.code,
        state: params.state,
      });
    } else {
      setMessage("An error occured.");
    }
  }, [setMessage]);

  if (message) {
    return <p>{message}</p>;
  }

  return <Loader />;
};

export default withGate(Callback, "feature_login");
