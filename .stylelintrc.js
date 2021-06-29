module.exports = {
    extends: [
        "stylelint-config-standard",
        "stylelint-config-sass-guidelines"
    ],
    plugins: [
        "stylelint-order",
        "stylelint-scss"
    ],
    ignoreFiles: [
        "src/**/*.ts{,x}",
        "src/**/*.js"
    ]
};
