import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./enforce-shadow-tokens";

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
  },
});

tester.run("enforce-shadow-tokens", rule as any, {
  valid: [
    { code: "<div className='shadow'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='shadow-xs'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='shadow-sm'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='shadow-md'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='shadow-lg'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='shadow-xl'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='shadow-primary'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='shadow-none'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='hover:shadow-md'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='shadow-2xl'></div>", filename: "/components/ui/button.tsx" },
    { code: "<div className='shadow-2xl'></div>", filename: "components/my-file.stories.tsx" },
    { code: "<div className='shadow-2xl'></div>", filename: "components/my-file.test.tsx" },
    { code: "const cls = 'shadow-2xl';", filename: "components/my-file.tsx" },
  ],
  invalid: [
    {
      code: "<div className='shadow-2xl'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useShadowToken" }],
    },
    {
      code: "<div className='shadow-inner'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useShadowToken" }],
    },
    {
      code: "<div className='shadow-[0_4px_6px_rgba(0,0,0,0.1)]'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitraryShadow" }],
    },
    {
      code: "<div className={'shadow-2xl'}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useShadowToken" }],
    },
    {
      code: "<div className={`shadow-2xl`}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useShadowToken" }],
    },
    {
      code: "<div className='hover:shadow-2xl'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useShadowToken" }],
    },
  ],
});
