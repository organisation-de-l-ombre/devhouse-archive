const LoadableWebpackPlugin = require("@loadable/webpack-plugin");
const path = require("path");

module.exports = {
    plugins: [
        "scss",
        {
            name: "typescript",
            options: {
                useBabel: true,
                tsLoader: {
                    transpileOnly: true,
                    experimentalWatchApi: false,
                },
            },
        },
    ],
    modifyWebpackConfig(opts) {
        const config = opts.webpackConfig;
        config.devtool = false;

        // add loadable webpack plugin only
        // when we are building the client bundle
        if (opts.env.target === "web") {
            const filename = path.resolve(__dirname, "build");

            // saving stats file to build folder
            // without this, stats files will go into
            // build/public folder
            config.plugins.push(
                new LoadableWebpackPlugin({
                    outputAsset: false,
                    writeToDisk: { filename },
                })
            );
        }

        if (opts.env.target === 'web' && opts.env.dev) {
            config.devServer.proxy = {
                context: () => true,
                target: 'http://localhost:3000',
                changeOrigin: true,
            };
            config.devServer.index = '';
        }

        return config;
    },
};