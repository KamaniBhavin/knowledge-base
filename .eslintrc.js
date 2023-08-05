module.exports = {
    env: {
        browser: false,
        es2021: true,
    },
    extends: "eslint:recommended",
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "no-console": "warn",
        "no-undef": "off",
    },
};
