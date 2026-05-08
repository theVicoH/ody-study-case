import { describe, it, beforeAll, afterAll } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./require-component-story";
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

const tempDir = path.resolve(__dirname, "../../components/molecules");
const validDir = path.resolve(tempDir, "card");
const invalidDir = path.resolve(tempDir, "list");

beforeAll(() => {
  fs.mkdirSync(validDir, { recursive: true });
  fs.writeFileSync(path.resolve(validDir, "card.molecule.tsx"), "export {}");
  fs.writeFileSync(path.resolve(validDir, "card.stories.tsx"), "export {}");

  fs.mkdirSync(invalidDir, { recursive: true });
  fs.writeFileSync(path.resolve(invalidDir, "list.molecule.tsx"), "export {}");
});

afterAll(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
  try { fs.rmdirSync(path.resolve(__dirname, "../../components")); } catch {}
});

tester.run("require-component-story", rule as any, {
  valid: [
    { code: "const x = 1;", filename: path.resolve(validDir, "card.molecule.tsx").replace(/\\/g, "/") },
    { code: "const x = 1;", filename: "<input>" },
    { code: "const x = 1;", filename: "components/molecules/button.molecule.tsx" },
    { code: "const x = 1;", filename: "/src/components/ui/button.stories.tsx" },
    { code: "const x = 1;", filename: "/src/components/ui/button.test.tsx" },
    { code: "const x = 1;", filename: "/src/components/ui/index.tsx" },
    { code: "const x = 1;", filename: "/src/components/other.tsx" }
  ],
  invalid: [
    {
      code: "const x = 1;",
      filename: path.resolve(invalidDir, "list.molecule.tsx").replace(/\\/g, "/"),
      errors: [{ messageId: "missingStory", data: { filename: "list.molecule.tsx", storyFile: "list.stories.tsx" } }]
    },
    {
      code: "const x = 1;",
      filename: "/src/components/ui/dialog.tsx",
      errors: [{ messageId: "missingStory" }]
    }
  ]
});
