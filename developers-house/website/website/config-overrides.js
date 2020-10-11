const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (config) => {
    if (!config.plugins) {
        config.plugins = [];
    }
    config.devtool = '';
    if (process.env.NODE_ENV === 'production')
        config.plugins.push(new UglifyJsPlugin());
    else
        config.plugins.push(new BundleAnalyzerPlugin());
    config.resolve.plugins.push(new TsconfigPathsPlugin());
    return config;
};
