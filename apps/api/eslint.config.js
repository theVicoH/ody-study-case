import globals from "globals";
import { default as tseslint } from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import customPlugin from "@workspace/lint-plugin-custom";

export default tseslint.config(
  {
    ignores: ["dist", ".output", "coverage/**"]
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parser: tseslint.parser
    },
    plugins: {
      "import": importPlugin,
      "custom": customPlugin
    },
    rules: {
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "comma-dangle": ["error", "never"],
      "eol-last": ["error", "always"],
      "function-paren-newline": ["error", "multiline"],
      "object-curly-newline": ["error", { "multiline": true, "consistent": true }],
      "array-bracket-newline": ["error", { "multiline": true }],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
        { blankLine: "always", prev: "function", next: "*" },
        { blankLine: "always", prev: "*", next: "function" },
        { blankLine: "always", prev: "*", next: "export" },
        { blankLine: "always", prev: "export", next: "*" }
      ],

      "custom/file-naming": "error",
      "custom/no-unnecessary-comments": "error",
      "custom/no-relative-parent-imports": "error",
      "custom/enforce-explicit-imports": "error",
      "custom/enforce-file-suffix": "error",
      "custom/require-unit-test": "error",
      "custom/enforce-folder-structure": "error",
      "custom/fix-explicit-any": "error",
      "custom/no-magic-numbers": [
        "error",
        {
          "ignoreArrayIndexes": true,
          "ignoreTypeIndexes": true,
          "ignoreEnums": true,
          "ignoreInTypeAnnotations": true,
          "ignoreInComparison": false,
          "ignoreConfigObjects": true,
          "ignoreObjectProperties": true,
          "ignoreCallArguments": true
        }
      ],

      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling"], "index", "type"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true }
        }
      ]
    }
  },
  {
    files: ["**/*.test.ts"],
    rules: {
      "custom/require-unit-test": "off"
    }
  }
);
