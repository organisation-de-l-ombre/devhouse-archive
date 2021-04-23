/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: 'Developer\'s House Documentation',
    tagline: 'Internal documentaiton for Developer\`s house services.',
    url: 'https://docs.matthieu-dev.xyz',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'developers-house', // Usually your GitHub org/user name.
    projectName: 'internal-documentation', // Usually your repo name.
    themeConfig: {
        navbar: {
            title: 'Developer\'s House',
            logo: {
                alt: 'My Site Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    type: 'localeDropdown',
                    position: 'left'
                },
                {
                    type: 'doc',
                    docId: 'intro',
                    position: 'left',
                    label: 'Main documentation',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [],
            copyright: `Copyright © ${new Date().getFullYear()} Developer's House. Built with Docusaurus.`,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
    i18n: {
        defaultLocale: "en",
        locales: [
            "en",
            "fr",
        ]
    }
};
