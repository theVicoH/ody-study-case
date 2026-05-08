import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./fix-raw-tailwind-colors";

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

tester.run("fix-raw-tailwind-colors", rule as any, {
  valid: [
    { code: "<div className='bg-primary text-primary-foreground'></div>", filename: "components/my-file.tsx" },
    { code: "<div className='text-muted-foreground'></div>", filename: "components/my-file.tsx" },
    { code: "const val = 'bg-primary';", filename: "components/my-file.tsx" },
    { code: "<div className='bg-slate-500'></div>", filename: "/components/ui/button.tsx" }
  ],
  invalid: [
    {
      code: "<div className='bg-blue-500'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useDesignToken" }],
      output: '<div className="bg-primary"></div>'
    },
    {
      code: "<div className='text-white'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useDesignToken" }],
      output: '<div className="text-primary-foreground"></div>'
    },
    {
      code: "<div className='hover:bg-gray-200'></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useDesignToken" }],
      output: '<div className="hover:bg-muted"></div>'
    },
    {
      code: "<div className={`bg-blue-500`}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useDesignToken" }],
      output: '<div className={`bg-primary`}></div>'
    },
    {
      code: "<div className={'bg-blue-500'}></div>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "useDesignToken" }],
      output: '<div className={"bg-primary"}></div>'
    }
  ]
});
