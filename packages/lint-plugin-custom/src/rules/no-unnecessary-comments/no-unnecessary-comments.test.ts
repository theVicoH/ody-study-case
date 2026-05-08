import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./no-unnecessary-comments";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

tester.run("no-unnecessary-comments", rule as any, {
  valid: [
    { code: "// TODO: Fix this later\nconst x = 1;" },
    { code: "// FIXME: This is broken\nconst x = 1;" },
    { code: "// eslint-disable-next-line\nconst x = 1;" },
    { code: "// @ts-expect-error\nconst x = 1;" },
    { code: "// ================\nconst x = 1;" },
    { code: "// --- title ---\nconst x = 1;" },
    { code: "// text at start ===\nconst x = 1;" },
    { code: "/* TODO: block comment */\nconst x = 1;" }
  ],
  invalid: [
    {
      code: "// This is an unnecessary comment\nconst x = 1;",
      errors: [{ messageId: "unnecessaryComment" }]
    },
    {
      code: "/* Just a note */\nconst x = 1;",
      errors: [{ messageId: "unnecessaryComment" }]
    }
  ]
});
