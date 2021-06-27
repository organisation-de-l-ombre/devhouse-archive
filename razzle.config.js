const LoadablePlugin = require("@loadable/webpack-plugin");

module.exports = {
  plugins: [
    {
      name: "typescript",
      options: {
        useBabel: true,
        tsLoader: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    },
    "scss",
  ],
  modifyWebpackConfig({ env: { target }, webpackConfig }) {
    if (target === "web") {
      webpackConfig.plugins.push(
        new LoadablePlugin({
          outputAsset: false,
          writeToDisk: { filename: "./build" },
        })
      );
    }

    return webpackConfig;
  },
};
