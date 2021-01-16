const router = require("pages/Navigator.tsx").default;
const Sitemap = require("react-router-sitemap").default;

function generateSitemap() {
    return (
        new Sitemap(router)
        .build("https://www.example.com")
        .save("./public/sitemap.xml")
    );
}

generateSitemap();