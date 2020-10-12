
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
    return config;
};
