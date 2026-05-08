import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./enforce-explicit-imports";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

tester.run("enforce-explicit-imports", rule as any, {
  valid: [
    { code: "import { cn } from '@/lib/utils';" },
    { code: "import { authService } from '@/services/auth';" },
    { code: "import { queryClient } from '@/lib/query-client';" }
  ],
  invalid: [
    {
      code: "import { cn } from '@/lib';",
      errors: [{ messageId: "shadcnUtils" }]
    },
    {
      code: "import { queryClient } from '@/lib';",
      errors: [{ messageId: "explicitImport", data: { wrongPath: "@/lib", correctPath: "@/lib/query-client" } }]
    },
    {
      code: "import { authService } from '@/services';",
      errors: [{ messageId: "explicitImport", data: { wrongPath: "@/services", correctPath: "@/services/auth (or specific service)" } }]
    }
  ]
});
