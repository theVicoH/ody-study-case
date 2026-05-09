import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./enforce-motion-tokens";

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

tester.run("enforce-motion-tokens", rule as any, {
  valid: [
    { code: "<div className='duration-instant'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='duration-fast'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='duration-base'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='duration-slow'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='duration-slower'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='ease-linear'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='ease-in'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='ease-out'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='ease-in-out'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='ease-emphasized'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='ease-bounce'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='hover:duration-fast'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='duration-150'></div>", filename: "/components/ui/button.tsx" },
    { code: "<div className='duration-150'></div>", filename: "components/my-file.stories.tsx" },
    { code: "<div className='duration-150'></div>", filename: "components/my-file.test.tsx" },
    { code: "<div className='duration-150'></div>", filename: "components/my-file.spec.tsx" },
    { code: "const cls = 'duration-150';", filename: "components/my-file.tsx" },
  ],
  invalid: [
    {
      code: "<div className='duration-150'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useDurationToken" }],
    },
    {
      code: "<div className='duration-300'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useDurationToken" }],
    },
    {
      code: "<div className='duration-[400ms]'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitraryDuration" }],
    },
    {
      code: "<div className='ease-custom'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useEasingToken" }],
    },
    {
      code: "<div className='ease-[cubic-bezier(0,0,1,1)]'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitraryEasing" }],
    },
    {
      code: "<div className={'duration-200'}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useDurationToken" }],
    },
    {
      code: "<div className={`duration-500`}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useDurationToken" }],
    },
    {
      code: "<div className='hover:duration-100'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useDurationToken" }],
    },
  ],
});
