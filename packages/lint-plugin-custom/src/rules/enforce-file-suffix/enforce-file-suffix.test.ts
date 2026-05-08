import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./enforce-file-suffix";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

tester.run("enforce-file-suffix", rule as any, {
  valid: [
    { code: "const x = 1;", filename: "/src/services/auth.service.ts" },
    { code: "const x = 1;", filename: "/src/hooks/use-auth.hook.ts" },
    { code: "const x = 1;", filename: "/src/components/atoms/button.atom.tsx" },
    { code: "const x = 1;", filename: "/src/components/molecules/search-input.molecule.tsx" },
    { code: "const x = 1;", filename: "/src/components/organisms/auth-form.organism.tsx" },
    { code: "const x = 1;", filename: "/src/components/layouts/auth-layout.layout.tsx" },
    { code: "const x = 1;", filename: "/src/lib/api-client.lib.ts" },
    { code: "const x = 1;", filename: "/src/lib/utils.ts" },
  ],
  invalid: [
    {
      code: "const x = 1;",
      filename: "/src/services/auth.ts",
      errors: [{ messageId: "wrongSuffix", data: { directory: "/services/", expectedSuffix: ".service.ts", example: "auth.service.ts" } }]
    },
    {
      code: "const x = 1;",
      filename: "/src/components/atoms/button.tsx",
      errors: [{ messageId: "componentSuffix" }]
    },
    {
      code: "const x = 1;",
      filename: "/src/components/molecules/card.tsx",
      errors: [{ messageId: "componentSuffix" }]
    },
    {
      code: "const x = 1;",
      filename: "/src/components/organisms/header.tsx",
      errors: [{ messageId: "componentSuffix" }]
    },
    {
      code: "const x = 1;",
      filename: "/src/components/layouts/main.tsx",
      errors: [{ messageId: "componentSuffix" }]
    }
  ]
});
