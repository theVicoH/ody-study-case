import { describe, it, beforeAll, afterAll } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./enforce-folder-structure";
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

const tempHooksDir = path.resolve(__dirname, "../../hooks");
const validHookDir = path.resolve(tempHooksDir, "use-test-valid");

beforeAll(() => {
  fs.mkdirSync(validHookDir, { recursive: true });
  fs.writeFileSync(path.resolve(validHookDir, "use-test-valid.hook.ts"), "export {}");
});

afterAll(() => {
  fs.rmSync(tempHooksDir, { recursive: true, force: true });
});

tester.run("enforce-folder-structure", rule as any, {
  valid: [
    { code: "const x = 1;", filename: path.resolve(validHookDir, "use-test-valid.hook.ts").replace(/\\/g, "/") },
    { code: "const x = 1;", filename: "/src/components/button.tsx" }, // Ignores non-restricted folders
    { code: "const x = 1;", filename: "/src/lib/api.ts" }, // Ignores /lib/
    { code: "const x = 1;", filename: "<input>" },
    { code: "const x = 1;", filename: "hooks/no-src.ts" },
    { code: "const x = 1;", filename: "/src/hooks/index.ts" },
    { code: "const x = 1;", filename: "/src/hooks/use-test.test.ts" },
    { code: "const x = 1;", filename: "/src/hooks/invalid-pattern.ts" }
  ],
  invalid: [
    {
      code: "const x = 1;",
      filename: "/src/hooks/use-auth.hook.ts",
      errors: [{ messageId: "mustBeInSubfolder", data: { directory: "/hooks/", subfolder: "use-auth", filename: "use-auth.hook.ts" } }]
    }
  ]
});
