const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
module.exports = (config) => {
    if (!config.plugins) {
        config.plugins = [];
    }
    config.devtool = undefined;
    if (process.env.NODE_ENV === 'production') {
        config.plugins.push(new UglifyJsPlugin());
        config.plugins.push(new WebpackObfuscator());
    } else {
        config.plugins.push(new BundleAnalyzerPlugin());
    }
    config.resolve.plugins.push(new TsconfigPathsPlugin());
    return config;
};
