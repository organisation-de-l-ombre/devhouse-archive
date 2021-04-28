const withImages = require("next-images");

module.exports = withImages({
  basePath: "/dialog",
  assetPrefix: "/dialog",
  api: {
    bodyParser: {
      sizeLimit: '500kb',
    },
  },
});
