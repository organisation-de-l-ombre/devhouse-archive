/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement, useEffect } from "react";
import { RequestParams } from "../../constants";

const Callback = (): ReactElement => {
  useEffect(() => {
    if (RequestParams.code && RequestParams.state) {
      const channel = new BroadcastChannel("callback");
      channel.postMessage({
        code: RequestParams.code,
        state: RequestParams.state,
      });
    }
  });

  return <></>;
};

export default Callback;
