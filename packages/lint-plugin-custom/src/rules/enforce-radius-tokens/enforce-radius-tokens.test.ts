import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./enforce-radius-tokens";

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

tester.run("enforce-radius-tokens", rule as any, {
  valid: [
    { code: "<div className='rounded'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-none'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-xs'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-sm'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-md'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-lg'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-xl'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-2xl'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-3xl'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-4xl'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-5xl'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-full'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-t-md'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-tl-lg'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='hover:rounded-lg'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='rounded-[8px]'></div>", filename: "/components/ui/button.tsx" },
    { code: "<div className='rounded-[8px]'></div>", filename: "components/my-file.stories.tsx" },
    { code: "<div className='rounded-[8px]'></div>", filename: "components/my-file.test.tsx" },
    { code: "const cls = 'rounded-[8px]';", filename: "components/my-file.tsx" },
  ],
  invalid: [
    {
      code: "<div className='rounded-[8px]'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitraryRadius" }],
    },
    {
      code: "<div className='rounded-3'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useRadiusToken" }],
    },
    {
      code: "<div className='rounded-t-[4px]'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitraryRadius" }],
    },
    {
      code: "<div className='rounded-tl-3'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useRadiusToken" }],
    },
    {
      code: "<div className={'rounded-[8px]'}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitraryRadius" }],
    },
    {
      code: "<div className={`rounded-[8px]`}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitraryRadius" }],
    },
    {
      code: "<div className='hover:rounded-[4px]'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitraryRadius" }],
    },
  ],
});
