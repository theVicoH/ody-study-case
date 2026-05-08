import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./no-arbitrary-color-values";

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

tester.run("no-arbitrary-color-values", rule as any, {
  valid: [
    { code: "<div className='bg-primary text-primary-foreground'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='bg-[#f5e0e9]'></div>", filename: "/components/ui/button.tsx" },
    { code: "const val = 'bg-[#f5e0e9]';", filename: "components/my-file.tsx" } 
  ],
  invalid: [
    {
      code: "<div className='bg-[#f5e0e9]'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitraryColors" }],
      output: '<div className="bg-muted"></div>'
    },
    {
      code: "<div className='text-[rgb(255,0,0)]'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitraryColors" }],
      output: '<div className="text-muted-foreground"></div>'
    },
    {
      code: "<div className='border-[#123] text-primary'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitraryColors" }],
      output: '<div className="border-border text-primary"></div>'
    },
    {
      code: "<div className={`bg-[#f5e0e9]`}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitraryColors" }],
      output: '<div className={`bg-muted`}></div>'
    },
    {
      code: "<div className={'bg-[#f5e0e9]'}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noArbitraryColors" }],
      output: '<div className={"bg-muted"}></div>'
    }
  ]
});
