/* eslint-disable import/extensions,@typescript-eslint/no-var-requires,global-require */
import express from "express";

let app = require("./server").default;

if (module.hot) {
  console.info("✅ Server-side HMR Enabled!");

  module.hot.accept("./server", () => {
    console.warn("🔁 HMR Reloading `./server`...");

    try {
      app = require("./server").default;
    } catch (error) {
      console.error(error);
    }
  });
}

const port = process.env.PORT || 3200;

export default express()
  .use((req, res) => app.handle(req, res))
  .listen(port, () => {
    console.log(`🚀 App started http://localhost:${port}`);
  });
