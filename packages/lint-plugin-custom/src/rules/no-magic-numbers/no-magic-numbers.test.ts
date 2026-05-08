import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./no-magic-numbers";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: { jsx: true }
    }
  }
});

tester.run("no-magic-numbers", rule as any, {
  valid: [
    { code: "const x = 0;", filename: "test.ts" },
    { code: "const x = 1;", filename: "test.ts" },
    { code: "const x = 2;", filename: "test.ts" },
    { code: "const x = -1;", filename: "test.ts" },
    { code: "const arr = [1, 2, 3];", filename: "test.ts" },
    { code: "type Foo = Array<100>;", filename: "test.ts" },
    { code: "interface Foo { bar: 100 }", filename: "test.ts" },
    { code: "enum Direction { Up = 1, Down = 2 }", filename: "test.ts" },
    { code: "type Age = 18;", filename: "test.ts" },
    { code: "const x = 100;", filename: "test.ts", options: [{ ignore: [100] }] },
    { code: "if (x > 100) {}", filename: "test.ts", options: [{ ignoreInComparison: true }] },
    { code: "const config = { timeout: 5000 };", filename: "test.ts" },
    { code: "export const HttpStatus = { OK: 200, NOT_FOUND: 404 } as const;", filename: "test.ts" },
    { code: "export const OTPConfig = { CODE_LENGTH: 6, EXPIRATION_MS: 600_000 } as const;", filename: "test.ts" },
    { code: "export const Limits = { MAX: 100, MIN: 3 } as const;", filename: "test.ts" }
  ],
  invalid: [
    {
      code: "const x = 42;",
      filename: "test.ts",
      errors: [{ messageId: "noMagicNumbers", data: { value: "42" } }]
    },
    {
      code: "const x = 100;",
      filename: "test.ts",
      errors: [{ messageId: "noMagicNumbers", data: { value: "100" } }]
    },
    {
      code: "const x = 3.14;",
      filename: "test.ts",
      errors: [{ messageId: "noMagicNumbers", data: { value: "3.14" } }]
    },
    {
      code: "const x = -42;",
      filename: "test.ts",
      errors: [{ messageId: "noMagicNumbers", data: { value: "42" } }]
    },
    {
      code: "const result = calculate(100);",
      filename: "test.ts",
      options: [{ ignoreCallArguments: false }],
      errors: [{ messageId: "noMagicNumbers", data: { value: "100" } }]
    },
    {
      code: "const x = 100 + 50;",
      filename: "test.ts",
      errors: [
        { messageId: "noMagicNumbers", data: { value: "100" } },
        { messageId: "noMagicNumbers", data: { value: "50" } }
      ]
    },
    {
      code: "interface Foo { bar: 100 }",
      filename: "test.ts",
      options: [{ ignoreInTypeAnnotations: false }],
      errors: [{ messageId: "noMagicNumbers", data: { value: "100" } }]
    },
    {
      code: "enum Direction { Up = 100 }",
      filename: "test.ts",
      options: [{ ignoreEnums: false }],
      errors: [{ messageId: "noMagicNumbers", data: { value: "100" } }]
    },
    {
      code: "const x = 100;",
      filename: "test.ts",
      options: [{ ignore: [] }],
      errors: [{ messageId: "noMagicNumbers", data: { value: "100" } }]
    },
    {
      code: "if (x > 10) {}",
      filename: "test.ts",
      errors: [{ messageId: "noMagicNumbers", data: { value: "10" } }]
    },
    {
      code: "const x: number = 42;",
      filename: "test.ts",
      options: [{ ignoreInTypeAnnotations: false }],
      errors: [{ messageId: "noMagicNumbers", data: { value: "42" } }]
    },
    {
      code: "const arr = new Array(5);",
      filename: "test.ts",
      errors: [{ messageId: "noMagicNumbers", data: { value: "5" } }]
    },
    {
      code: "const x = 100;",
      filename: "test.ts",
      options: [{ ignore: [], ignoreInTypeAnnotations: false }],
      errors: [{ messageId: "noMagicNumbers", data: { value: "100" } }]
    }
  ]
});
