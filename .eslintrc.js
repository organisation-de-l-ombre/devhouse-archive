module.exports = {
    extends: [
        "airbnb-typescript",
        "airbnb/hooks",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended",
        "prettier",
        "prettier/react",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ],
    plugins: ["react", "@typescript-eslint", "jest"],
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
    },
    rules: {
        "linebreak-style": "off",
        "import/prefer-default-export": "off",
        "react/prop-types": "off",
        "react/require-default-props": "off",
        "no-param-reassign": "off",
        "@typescript-eslint/triple-slash-reference": "off",
        "react/jsx-props-no-spreading": "off",
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto",
            },
        ],
        "global-require": "off",
        "import/no-dynamic-require": "off",
        "no-alert": "off",
        "no-console": "off",
        "import/no-cycle": "off"
    },
};
