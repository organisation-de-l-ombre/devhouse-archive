import Application from "@application/Application";
import React, { FC } from "react";
import { loadableReady } from "@loadable/component";
import { hydrate } from "react-dom";

loadableReady((): void => {
  const RootComponent: FC = () => {
    return <Application />;
  };

  hydrate(<RootComponent />, document.querySelector(".app"));
});

if (module.hot) {
  module.hot.accept();
}
