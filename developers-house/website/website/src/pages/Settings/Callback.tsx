/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement, useEffect, useState } from "react";
import { withGate } from "@components/FeatureGate/FeatureGateProvider";
import { RequestParams } from "../../constants";
import { Loader } from "../../components/SuspenseLoader/SuspenseLoader";

const Callback = (): ReactElement => {
  const [message, setMessage] = useState<string>();
  useEffect(() => {
    if (RequestParams.code && RequestParams.state) {
      const channel = new BroadcastChannel("callback");
      channel.postMessage({
        code: RequestParams.code,
        state: RequestParams.state,
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
