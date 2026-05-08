import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./fix-explicit-any";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

tester.run("fix-explicit-any", rule as any, {
  valid: [
    { code: "function test(a: string) {}" },
    { code: "const val: number = 5;" },
  ],
  invalid: [
    {
      code: "function test(a: any) {}",
      errors: [{ messageId: "noAny" }],
      output: "function test(a: unknown) {}"
    },
    {
      code: "function test(a: any) { console.log(a.id); }",
      errors: [{ messageId: "noAny" }],
      output: "function test(a: { id: unknown }) { console.log(a.id); }"
    },
    {
      code: "const arr: any[] = [];",
      errors: [{ messageId: "noAny" }],
      output: "const arr: Array<unknown> = [];"
    },
    {
      code: "function test(a: any[]) { console.log(a[0].id); }",
      errors: [{ messageId: "noAny" }],
      output: "function test(a: Array<{ id: unknown }>) { console.log(a[0].id); }"
    },
    {
      code: "const val: any = doSomething();",
      errors: [{ messageId: "noAny" }],
      output: "const val: unknown = doSomething();"
    },
    {
      code: "const val: any = {};",
      errors: [{ messageId: "noAny" }],
      output: "const val: Record<string, unknown> = {};"
    }
  ]
});
