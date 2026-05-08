import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./no-relative-parent-imports";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: {
    parser,
    ecmaVersion: "latest",
    sourceType: "module",
  },
});

tester.run("no-relative-parent-imports", rule as any, {
  valid: [
    { code: "import { User } from '@/types/user';", filename: "/src/components/card.tsx" },
    { code: "import { Button } from './button';", filename: "/src/components/card.tsx" },
    { code: "import { a } from '../index';", filename: "other-file.ts" },
    { code: "import { a } from '../index';", filename: "<input>" }
  ],
  invalid: [
    {
      code: "import { User } from '../../types/user';",
      filename: "/src/components/atoms/card.tsx",
      errors: [{ messageId: "noRelativeParent", data: { relativePath: "../../types/user", absolutePath: "types/user" } }]
    },
    {
      code: "import { format } from '../utils/format';",
      filename: "/src/hooks/use-data.ts",
      errors: [{ messageId: "noRelativeParent", data: { relativePath: "../utils/format", absolutePath: "utils/format" } }]
    }
  ]
});
