import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Theming",
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
          <span className="typo-overline text-muted-foreground">Theming</span>
          <h1 className="typo-h1 text-foreground">Light & Dark Mode</h1>
          <p className="typo-body-lg text-muted-foreground">
            Ody UI uses CSS custom properties for theming. Switching themes is as simple as toggling the <code className="typo-code bg-muted px-xs rounded-sm">.dark</code> class on the root element.
          </p>
        </div>

        <div className="gap-lg flex flex-col">
          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">How it works</h2>
            <p className="typo-body text-muted-foreground">All tokens are defined in CSS custom properties. The <code className="typo-code bg-muted px-xs rounded-sm">:root</code> block holds light values, and the <code className="typo-code bg-muted px-xs rounded-sm">.dark</code> block overrides them. No JavaScript re-renders — pure CSS cascading.</p>
            <CodeBlock code={":root {\n  --primary: oklch(0.55 0.258 304); /* violet */\n  --background: oklch(0.985 0.002 286); /* near-white */\n}\n\n.dark {\n  --primary: oklch(0.626 0.258 304); /* brighter violet */\n  --background: oklch(0.12 0.022 285); /* deep dark */\n}"} />
          </div>

          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">Color format: OKLCH</h2>
            <p className="typo-body text-muted-foreground">All colors use the OKLCH color space for perceptual uniformity. Lightness (L), Chroma (C), and Hue (H) map predictably — adjusting L keeps the hue intact across themes.</p>
            <div className="gap-sm grid grid-cols-3">
              {[
                { label: "L — Lightness", range: "0 (black) → 1 (white)", note: "Perceptually uniform" },
                { label: "C — Chroma", range: "0 (grey) → ~0.37 (vivid)", note: "Saturation equivalent" },
                { label: "H — Hue", range: "0° → 360°", note: "Color wheel angle" }
              ].map((item) => (
                <div key={item.label} className="border-border bg-card p-md gap-xs flex flex-col rounded-lg border">
                  <span className="typo-caption text-primary font-medium">{item.label}</span>
                  <span className="typo-body-sm text-foreground font-mono">{item.range}</span>
                  <span className="typo-caption text-muted-foreground">{item.note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">Overriding tokens</h2>
            <p className="typo-body text-muted-foreground">Brand customization: override CSS variables at the app level after importing globals.css. Do not edit globals.css directly.</p>
            <CodeBlock code={"/* app-overrides.css — import AFTER @workspace/ui/globals.css */\n:root {\n  --primary: oklch(0.55 0.22 142); /* brand green instead of violet */\n  --accent: oklch(0.65 0.18 80);   /* brand amber */\n  --radius: 0.5rem;                /* sharper corners */\n}"} />
          </div>

          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">Toggle with next-themes</h2>
            <CodeBlock code={"\"use client\";\nimport { useTheme } from \"next-themes\";\nimport { Button } from \"@workspace/ui/components/ui/button\";\n\nexport const ThemeToggle = () => {\n  const { theme, setTheme } = useTheme();\n  return (\n    <Button\n      variant=\"ghost\"\n      onClick={() => setTheme(theme === \"dark\" ? \"light\" : \"dark\")}\n    >\n      {theme === \"dark\" ? \"Light mode\" : \"Dark mode\"}\n    </Button>\n  );\n};"} />
          </div>
        </div>
      </div>
    </div>
  )
};
