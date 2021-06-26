import express from "express";

declare global {
  interface Window {
    INSTATE: string;
    LANG: string;
    PRELOADED_STATE: string;
    REACT_QUERY: string;
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
