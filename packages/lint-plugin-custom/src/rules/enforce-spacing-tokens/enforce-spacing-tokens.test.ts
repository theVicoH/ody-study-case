import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./enforce-spacing-tokens";

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

tester.run("enforce-spacing-tokens", rule as any, {
  valid: [
    { code: "<div className='p-xs'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-sm'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-md'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-lg'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-xl'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-2xl'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-3xl'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-4xl'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-3xs'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-2xs'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-0'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-auto'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-full'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-px'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='m-xs gap-sm'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='w-1/2'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='hover:p-sm'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='p-4'></div>", filename: "/components/ui/button.tsx" },
    { code: "<div className='p-4'></div>", filename: "components/my-file.stories.tsx" },
    { code: "<div className='p-4'></div>", filename: "components/my-file.test.tsx" },
    { code: "const cls = 'p-4';", filename: "components/my-file.tsx" },
  ],
  invalid: [
    {
      code: "<div className='p-4'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useSpacingToken" }],
    },
    {
      code: "<div className='m-8'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useSpacingToken" }],
    },
    {
      code: "<div className='gap-6'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useSpacingToken" }],
    },
    {
      code: "<div className='w-96'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useSpacingToken" }],
    },
    {
      code: "<div className='p-[20px]'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitrarySpacing" }],
    },
    {
      code: "<div className='mt-[1.5rem]'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitrarySpacing" }],
    },
    {
      code: "<div className={'p-4'}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useSpacingToken" }],
    },
    {
      code: "<div className={`p-4`}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useSpacingToken" }],
    },
    {
      code: "<div className='hover:p-4'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useSpacingToken" }],
    },
  ],
});
