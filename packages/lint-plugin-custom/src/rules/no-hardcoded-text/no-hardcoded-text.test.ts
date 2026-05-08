import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import * as parser from "@typescript-eslint/parser";
import rule from "./no-hardcoded-text";

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

tester.run("no-hardcoded-text", rule as any, {
  valid: [
    { code: "<Button> {t('common.buttons.submit')} </Button>", filename: "components/my-file.tsx" },
    { code: "<div className='bg-red-500'></div>", filename: "components/my-file.tsx" },
    { code: "<Button>{123}</Button>", filename: "components/my-file.tsx" },
    { code: "<a href='https://example.com'></a>", filename: "components/my-file.tsx" },
    { code: "<label>{t('label.id')}</label>", filename: "components/my-file.tsx" },
    { code: "<img src='image.png' />", filename: "components/my-file.tsx" },
    { code: "const val = 'This should be ignored';", filename: "components/my-file.tsx" },
    { code: "const x = 1;", filename: "services/test.service.ts" },
    { code: "<Component value='<test>' />", filename: "components/my-file.tsx" },
    { code: "<Component value='./test' />", filename: "components/my-file.tsx" },
    { code: "<Component value='../test' />", filename: "components/my-file.tsx" },
    { code: "<Component value='#test' />", filename: "components/my-file.tsx" },
    { code: "<Component value='@test' />", filename: "components/my-file.tsx" },
    { code: "<Component value='test@test.com' />", filename: "components/my-file.tsx" },
    { code: "<Component value='bg-red-500 hover:bg-red-600' />", filename: "components/my-file.tsx" },
    { code: "<Component value='hello-world' />", filename: "components/my-file.tsx" },
    { code: "<Component attr='title' title='12345' />", filename: "components/my-file.tsx" }
  ],
  invalid: [
    {
      code: "<Button>Submit Form</Button>",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noHardcodedText", data: { key: "common.buttons.submit-form" } }]
    },
    {
      code: "<div>Welcome to the App</div>",
      filename: "user/welcome.component.tsx",
      errors: [{ messageId: "noHardcodedText", data: { key: "common.welcome-to-the-app" } }]
    },
    {
      code: "<input placeholder='Enter your name' />",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noHardcodedText", data: { key: "common.placeholders.enter-your-name" } }]
    },
    {
      code: "<img alt='Profile picture' />",
      filename: "components/my-file.tsx",
      errors: [{ messageId: "noHardcodedText", data: { key: "common.alt.profile-picture" } }]
    }
  ]
});
