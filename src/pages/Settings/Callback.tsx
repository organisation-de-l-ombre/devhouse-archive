/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement, useEffect } from "react";
import { RequestParams } from "../../constants";

const Callback = (): ReactElement => {
  useEffect(() => {
    if (RequestParams.access_token && RequestParams.state) {
      if (localStorage.getItem("state-oauth") === RequestParams.state) {
        localStorage.removeItem("state-oauth");
        const channel = new BroadcastChannel("callback");
        channel.postMessage({
          token: RequestParams.access_token,
          state: RequestParams.state,
        });
      }
    }
  });

  return <></>;
};

export default Callback;
