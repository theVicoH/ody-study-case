import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Getting Started",
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "responsive" } }
};

export default meta;

type Story = StoryObj;

const CodeBlock = ({ code }: { code: string }): React.JSX.Element => (
  <pre className="border-border bg-muted p-md typo-code text-foreground overflow-x-auto rounded-lg border">
    <code>{code}</code>
  </pre>
);

export const Default: Story = {
  render: () => (
    <div className="bg-background p-xl min-h-screen w-full">
      <div className="gap-2xl mx-auto flex max-w-[56rem] flex-col">
        <div className="gap-md flex flex-col">
          <span className="typo-overline text-muted-foreground">Getting Started</span>
          <h1 className="typo-h1 text-foreground">Using Ody UI</h1>
          <p className="typo-body-lg text-muted-foreground">Everything you need to start building with the design system.</p>
        </div>

        <div className="gap-lg flex flex-col">
          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">1. Import global styles</h2>
            <p className="typo-body text-muted-foreground">Add the global stylesheet at your app entry point to load all design tokens and typography utilities.</p>
            <CodeBlock code={"// app/layout.tsx or main.tsx\nimport \"@workspace/ui/globals.css\";"} />
          </div>

          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">2. Import components</h2>
            <p className="typo-body text-muted-foreground">Use explicit imports — no barrel imports. Import from the component path directly.</p>
            <CodeBlock code={"// ✅ Correct — explicit path\nimport { Button } from \"@workspace/ui/components/ui/button\";\nimport { Card } from \"@workspace/ui/components/ui/card\";\n\n// ❌ Wrong — barrel import\nimport { Button, Card } from \"@workspace/ui/components\";"} />
          </div>

          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">3. Light / Dark theme</h2>
            <p className="typo-body text-muted-foreground">Theming is CSS-class-based. Add <code className="typo-code bg-muted px-xs rounded-sm">.dark</code> to your root element to enable dark mode. Use <code className="typo-code bg-muted px-xs rounded-sm">next-themes</code> for React management.</p>
            <CodeBlock code={"import { ThemeProvider } from \"next-themes\";\n\nexport const App = () => (\n  <ThemeProvider attribute=\"class\" defaultTheme=\"dark\">\n    <YourApp />\n  </ThemeProvider>\n);"} />
          </div>

          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">4. Using design tokens</h2>
            <p className="typo-body text-muted-foreground">Always use semantic tokens, never raw colors. Tokens are available as Tailwind classes and CSS variables.</p>
            <CodeBlock code={"// ✅ Semantic tokens\n<div className=\"bg-primary text-primary-foreground\">\n<div className=\"bg-muted text-muted-foreground\">\n<div className=\"border border-border rounded-lg\">\n\n// ❌ Raw colors (ESLint error)\n<div className=\"bg-blue-500 text-white\">\n<div className=\"bg-[#1a1a2e]\">"} />
          </div>

          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">5. Typography utilities</h2>
            <p className="typo-body text-muted-foreground">Use the typography utility classes instead of raw font-size/weight combinations. They encode the full typographic spec including line-height and letter-spacing.</p>
            <CodeBlock code={"<h1 className=\"typo-h1\">Page Title</h1>\n<h2 className=\"typo-h2\">Section</h2>\n<p className=\"typo-body text-muted-foreground\">Body text</p>\n<span className=\"typo-caption text-muted-foreground\">Caption</span>\n<code className=\"typo-code\">inline code</code>"} />
          </div>
        </div>
      </div>
    </div>
  )
};
