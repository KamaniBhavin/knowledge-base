module.exports = {
    env: {
        browser: false,
        es2021: true,
    },
    extends: "eslint:recommended",
    overrides: [],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],
        "no-console": "warn",
        "no-undef": "off",
        "no-unused-vars": "warn",
    },
    ignorePatterns: [
        "node_modules/",
    ],
};
