import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./enforce-typography-tokens";

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

tester.run("enforce-typography-tokens", rule as any, {
  valid: [
    { code: "<div className='typo-display'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='typo-h1'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='typo-h2'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='typo-h3'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='typo-h4'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='typo-h5'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='typo-body-lg'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='typo-body'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='typo-body-sm'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='typo-caption'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='typo-overline'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='typo-button'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='typo-code'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='font-sans'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='font-heading'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='text-left'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='text-center'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='text-primary'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='text-muted-foreground'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='uppercase'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='italic'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='text-xl'></div>", filename: "/components/ui/button.tsx" },
    { code: "<div className='text-xl'></div>", filename: "components/my-file.stories.tsx" },
    { code: "<div className='text-xl'></div>", filename: "components/my-file.test.tsx" },
    { code: "const cls = 'text-xl';", filename: "components/my-file.tsx" },
  ],
  invalid: [
    {
      code: "<div className='text-xl'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useTypoPreset" }],
    },
    {
      code: "<div className='text-sm'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useTypoPreset" }],
    },
    {
      code: "<div className='text-2xl'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useTypoPreset" }],
    },
    {
      code: "<div className='font-bold'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useTypoPreset" }],
    },
    {
      code: "<div className='font-semibold'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useTypoPreset" }],
    },
    {
      code: "<div className='font-mono'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useTypoPreset" }],
    },
    {
      code: "<div className='tracking-wide'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useTypoPreset" }],
    },
    {
      code: "<div className='leading-relaxed'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useTypoPreset" }],
    },
    {
      code: "<div className='leading-6'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useTypoPreset" }],
    },
    {
      code: "<div className={'text-lg'}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useTypoPreset" }],
    },
    {
      code: "<div className={`text-base`}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useTypoPreset" }],
    },
    {
      code: "<div className='hover:text-xl'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useTypoPreset" }],
    },
  ],
});
