import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["node_modules"]),
  {
    files: ["**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      sourceType: "commonjs",
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
      "no-console": "warn",
    },
  },
]);
