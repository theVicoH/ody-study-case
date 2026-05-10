import globals from "globals";
import react from "eslint-plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";
import { default as tseslint } from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import customPlugin from "@workspace/lint-plugin-custom";

export default tseslint.config(
  {
    ignores: ["dist", "coverage/**"]
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser
    },
    settings: {
      react: { version: "18.3" }
    },
    plugins: {
      "react": react,
      "react-refresh": reactRefresh,
      "import": importPlugin,
      "custom": customPlugin
    },
    rules: {
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "comma-dangle": ["error", "never"],
      "eol-last": ["error", "always"],

      "custom/file-naming": "error",
      "custom/no-unnecessary-comments": "error",
      "custom/no-relative-parent-imports": "error",
      "custom/enforce-explicit-imports": "error",
      "custom/fix-explicit-any": "error",

      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function", unnamedComponents: "arrow-function" }
      ],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling"], "index", "type"],
          pathGroups: [{ pattern: "react", group: "external", position: "before" }],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true }
        }
      ]
    }
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    rules: {}
  }
);
