import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["eslint.config.mjs"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommededTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.mocha,
        ...globals.cypress,
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
  },
  {
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "function", next: "*" },
      ],
      "no-console": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
);
