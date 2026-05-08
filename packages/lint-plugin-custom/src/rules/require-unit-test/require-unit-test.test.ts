import { describe, it, beforeAll, afterAll } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./require-unit-test";
import fs from "fs";
import path from "path";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

const tempDir = path.resolve(__dirname, "../../services");
const validDir = path.resolve(tempDir, "auth");
const invalidDir = path.resolve(tempDir, "user");

beforeAll(() => {
  fs.mkdirSync(validDir, { recursive: true });
  fs.writeFileSync(path.resolve(validDir, "auth.service.ts"), "export {}");
  fs.writeFileSync(path.resolve(validDir, "auth.service.test.ts"), "export {}");
  
  fs.mkdirSync(invalidDir, { recursive: true });
  fs.writeFileSync(path.resolve(invalidDir, "user.service.ts"), "export {}");
});

afterAll(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

tester.run("require-unit-test", rule as any, {
  valid: [
    { code: "const x = 1;", filename: path.resolve(validDir, "auth.service.ts").replace(/\\/g, "/") },
    { code: "const x = 1;", filename: "<input>" },
    { code: "const x = 1;", filename: "services/test.service.ts" },
    { code: "const x = 1;", filename: "/src/services/test.service.test.ts" },
    { code: "const x = 1;", filename: "/src/services/utils.ts" }
  ],
  invalid: [
    {
      code: "const x = 1;",
      filename: path.resolve(invalidDir, "user.service.ts").replace(/\\/g, "/"),
      errors: [{ messageId: "missingTest", data: { filename: "user.service.ts", testFile: "user.service.test.ts" } }]
    }
  ]
});
