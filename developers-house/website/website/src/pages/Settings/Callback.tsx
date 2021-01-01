/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement, useEffect } from "react";

const Callback = (): ReactElement => {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const parameters: {
      [key: string]: string;
    } = {};
    hash.split("&").forEach((hk) => {
      const temporary = hk.split("=");
      parameters[temporary[0]] = temporary[1];
    });

    if (
      parameters["access_token"] &&
      parameters["state"] &&
      localStorage.getItem("state-oauth") === parameters["state"]
    ) {
      localStorage.removeItem("state-oauth");
      const channel = new BroadcastChannel("callback");
      channel.postMessage({
        token: parameters["access_token"],
        state: parameters["state"]
      });
    }
  });

  return <></>;
};

export default Callback;
