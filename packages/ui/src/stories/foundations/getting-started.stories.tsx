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
            <h2 className="typo-h2 text-foreground">2. Import primitives</h2>
            <p className="typo-body text-muted-foreground">Use explicit imports — no barrel imports. All 25 Shadcn primitives are available under <code className="typo-code bg-muted px-xs rounded-sm">components/ui/</code>.</p>
            <CodeBlock code={"// ✅ Correct — explicit path\nimport { Button } from \"@workspace/ui/components/ui/button\";\nimport { Card, CardHeader, CardContent } from \"@workspace/ui/components/ui/card\";\nimport { Avatar, AvatarFallback, AvatarImage } from \"@workspace/ui/components/ui/avatar\";\nimport { Calendar } from \"@workspace/ui/components/ui/calendar\";\nimport { Pagination, PaginationContent, PaginationItem } from \"@workspace/ui/components/ui/pagination\";\nimport { Badge } from \"@workspace/ui/components/ui/badge\";\nimport { Input } from \"@workspace/ui/components/ui/input\";\nimport { Select, SelectContent, SelectItem, SelectTrigger } from \"@workspace/ui/components/ui/select\";\nimport { Dialog, DialogContent, DialogHeader } from \"@workspace/ui/components/ui/dialog\";\nimport { Tabs, TabsList, TabsTrigger, TabsContent } from \"@workspace/ui/components/ui/tabs\";\nimport { Tooltip, TooltipContent, TooltipTrigger } from \"@workspace/ui/components/ui/tooltip\";\nimport { Skeleton } from \"@workspace/ui/components/ui/skeleton\";\nimport { Switch } from \"@workspace/ui/components/ui/switch\";\nimport { Checkbox } from \"@workspace/ui/components/ui/checkbox\";\n\n// ❌ Wrong — barrel import\nimport { Button, Card } from \"@workspace/ui/components\";"} />
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

          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">6. Icons</h2>
            <p className="typo-body text-muted-foreground">20 animated SVG icons built with Motion. Each animates on hover. See <strong>Foundations / All Icons</strong> for the full catalog.</p>
            <CodeBlock code={"import { SearchIcon } from \"@workspace/ui/components/icons/search/search.icon\";\nimport { ArrowLeftIcon } from \"@workspace/ui/components/icons/arrow-left/arrow-left.icon\";\nimport { HouseIcon } from \"@workspace/ui/components/icons/home/home.icon\";\nimport { PlusIcon } from \"@workspace/ui/components/icons/plus/plus.icon\";\nimport { TrashIcon } from \"@workspace/ui/components/icons/trash/trash.icon\";\n\n// Animated on hover (default)\n<SearchIcon size={20} />\n\n// Static — no animation\n<ArrowLeftIcon size={20} isAnimated={false} />\n\n// Custom color\n<PlusIcon size={20} className=\"text-primary\" />"} />
          </div>

          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">7. Glass utilities</h2>
            <p className="typo-body text-muted-foreground">Apply glassmorphism with a single class. Works best over a gradient or image background.</p>
            <CodeBlock code={"// Standard glass panel\n<div className=\"glass rounded-xl p-lg\">\n\n// Strong glass (modals)\n<div className=\"glass-strong rounded-xl p-lg\">\n\n// Semantic state glass\n<div className=\"glass-warning rounded-xl p-md\">\n<div className=\"glass-error rounded-xl p-md\">\n<div className=\"glass-primary rounded-xl p-md\">"} />
          </div>
        </div>
      </div>
    </div>
  )
};
