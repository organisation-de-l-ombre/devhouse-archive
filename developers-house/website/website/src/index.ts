import { RootState } from "@state/redux";
import express from "express";
import { Resource } from "i18next";
import { DeepPartial } from "redux";

declare global {
  interface Window {
    INSTATE: Resource;
    LANG: string;
    PRELOADED_STATE: DeepPartial<RootState>;
    REACT_QUERY: unknown;
  }
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
let app = require("./server").default;

if (module.hot) {
  module.hot.accept("./server", () => {
    console.log("🔁  HMR Reloading `./server`...");
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
      app = require("./server").default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info("✅  Server-side HMR Enabled!");
}

const port = process.env.PORT || 3000;

export default express()
  .use((req, res) => app.handle(req, res))
  .listen(port, () => {
    console.log(`> Started on port ${port}`);
  });
