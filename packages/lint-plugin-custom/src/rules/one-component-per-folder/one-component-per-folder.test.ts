import { describe, it, beforeAll, afterAll } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./one-component-per-folder";
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

const tempDir = path.resolve(__dirname, "../../components/atoms");
const validDir = path.resolve(tempDir, "button");
const invalidDir = path.resolve(tempDir, "group");

beforeAll(() => {
  fs.mkdirSync(validDir, { recursive: true });
  fs.writeFileSync(path.resolve(validDir, "button.component.tsx"), "export {}");
  
  fs.mkdirSync(invalidDir, { recursive: true });
  fs.writeFileSync(path.resolve(invalidDir, "group.component.tsx"), "export {}");
  fs.writeFileSync(path.resolve(invalidDir, "item.component.tsx"), "export {}");
});

afterAll(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
  try { fs.rmdirSync(path.resolve(__dirname, "../../components")); } catch {}
});

tester.run("one-component-per-folder", rule as any, {
  valid: [
    { code: "const x = 1;", filename: path.resolve(validDir, "button.component.tsx").replace(/\\/g, "/") },
    { code: "const x = 1;", filename: "/src/components/atoms/fake-dir-that-does-not-exist/fake.component.tsx" },
    { code: "const x = 1;", filename: "<input>" },
    { code: "const x = 1;", filename: "components/atoms/fake.tsx" },
    { code: "const x = 1;", filename: "/src/components/button.component.tsx" }
  ],
  invalid: [
    {
      code: "const x = 1;",
      filename: path.resolve(invalidDir, "group.component.tsx").replace(/\\/g, "/"),
      errors: [{ messageId: "multipleComponents", data: { folderName: "group", files: "group.component.tsx, item.component.tsx" } }]
    }
  ]
});
