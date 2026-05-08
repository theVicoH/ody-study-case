import globals from "globals";
import react from "eslint-plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";
import { default as tseslint } from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import betterTailwind from "eslint-plugin-better-tailwindcss";
import customPlugin from "@workspace/lint-plugin-custom";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "_webpack_front/**",
      "wailsjs/**",
      "src/routeTree.gen.ts",
      "temp/**",
      "coverage/**"
    ]
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser
    },
    settings: {
      react: { version: "18.3" },
      tailwindcss: { version: 4 }
    },
    plugins: {
      "react": react,
      "react-refresh": reactRefresh,
      "import": importPlugin,
      "better-tailwindcss": betterTailwind,
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
      "custom/no-hardcoded-text": "error",
      "custom/no-unnecessary-comments": "error",
      "custom/require-component-story": "error",
      "custom/require-unit-test": "error",
      "custom/enforce-folder-structure": "error",
      "custom/enforce-file-suffix": "error",
      "custom/no-relative-parent-imports": "error",
      "custom/enforce-explicit-imports": "error",
      "custom/no-arbitrary-color-values": "error",
      "custom/one-component-per-folder": "error",
      "custom/fix-raw-tailwind-colors": "error",
      "custom/fix-explicit-any": "error",
      "custom/enforce-spacing-tokens": "error",
      "custom/enforce-radius-tokens": "error",
      "custom/enforce-shadow-tokens": "error",
      "custom/enforce-typography-tokens": "error",
      "custom/enforce-motion-tokens": "error",
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

      "react/function-component-definition": [
        "error",
        { namedComponents: "arrow-function", unnamedComponents: "arrow-function" }
      ],
      "react/no-unused-prop-types": "error",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      "better-tailwindcss/enforce-consistent-class-order": "error",
      "better-tailwindcss/no-conflicting-classes": "error",
      "better-tailwindcss/no-deprecated-classes": "error",
      "better-tailwindcss/no-duplicate-classes": "error",
      "better-tailwindcss/no-unnecessary-whitespace": "error",
      "better-tailwindcss/no-restricted-classes": [
        "error",
        {
          restrict: [
            {
              pattern: "^(bg|text|border|ring|fill|stroke|from|via|to)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)$",
              message: "Use shadcn/ui design tokens instead of raw Tailwind colors."
            },
            {
              pattern: "^(bg|text|border|ring|fill|stroke|from|via|to)-(black|white)$",
              message: "Use shadcn/ui design tokens instead of black/white."
            }
          ]
        }
      ],

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
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react/function-component-definition": "off"
    }
  },
  {
    files: ["src/routes/**/*.{ts,tsx}"],
    rules: {
      "custom/no-hardcoded-text": "off",
      "custom/enforce-file-suffix": "off",
      "react/function-component-definition": "off"
    }
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    rules: {
      "custom/no-hardcoded-text": "off",
      "better-tailwindcss/no-restricted-classes": "off",
      "custom/no-arbitrary-color-values": "off",
      "custom/fix-raw-tailwind-colors": "off",
      "custom/enforce-spacing-tokens": "off",
      "custom/enforce-radius-tokens": "off",
      "custom/enforce-shadow-tokens": "off",
      "custom/enforce-typography-tokens": "off",
      "custom/enforce-motion-tokens": "off"
    }
  },
  {
    files: ["**/*.stories.{ts,tsx}"],
    rules: {
      "custom/no-arbitrary-color-values": "off",
      "custom/fix-raw-tailwind-colors": "off",
      "custom/enforce-spacing-tokens": "off",
      "custom/enforce-radius-tokens": "off",
      "custom/enforce-shadow-tokens": "off",
      "custom/enforce-typography-tokens": "off",
      "custom/enforce-motion-tokens": "off"
    }
  },
  {
    files: ["src/hooks/use-api/**/*.ts"],
    rules: {
      "custom/require-unit-test": "off"
    }
  }
);
