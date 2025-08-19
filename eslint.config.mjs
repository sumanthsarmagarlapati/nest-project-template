// eslint.config.mjs
import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/node_modules/**", "eslint.config.mjs"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // TypeScript & JS common rules
      "no-console": ["warn", { allow: ["log", "warn"] }],
      "no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-var-requires": "off",
      "no-multiple-empty-lines": ["warn", { max: 3, maxEOF: 3, maxBOF: 3 }],

      // Prettier config disables conflicting rules
      ...prettierConfig.rules,
      // "padding-lines-between-statements": [
      //   "error",
      //   { blankLine: "always", prev: "*", next: "return" }
      // ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // Make Prettier formatting issues show as ESLint errors
      "prettier/prettier": "warn",
    },
  },
);
