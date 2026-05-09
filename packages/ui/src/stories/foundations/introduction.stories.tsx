import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Introduction",
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "responsive" } }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="bg-background p-xl min-h-screen w-full">
      <div className="gap-2xl mx-auto flex max-w-[56rem] flex-col">
        <div className="gap-md flex flex-col">
          <div className="gap-xs border-border bg-muted px-sm py-xs inline-flex w-fit items-center rounded-full border">
            <span className="typo-overline text-muted-foreground">Design System</span>
          </div>
          <h1 className="typo-display text-gradient-brand">Ody UI</h1>
          <p className="typo-body-lg text-muted-foreground max-w-[42rem]">
            A comprehensive design system for modern restaurant SaaS dashboards. Built on Tailwind v4, React 19, and Shadcn UI — scalable, accessible, and production-ready.
          </p>
        </div>

        <div className="gap-md grid grid-cols-3">
          {[
            { label: "Components", count: "20+", desc: "Primitives, atoms, organisms" },
            { label: "Design Tokens", count: "60+", desc: "Colors, spacing, motion" },
            { label: "Patterns", count: "4", desc: "Composed UI patterns" }
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-lg gap-xs flex flex-col">
              <span className="typo-display text-primary">{stat.count}</span>
              <span className="typo-h5 text-foreground">{stat.label}</span>
              <span className="typo-body-sm text-muted-foreground">{stat.desc}</span>
            </div>
          ))}
        </div>

        <div className="gap-md flex flex-col">
          <h2 className="typo-h2 text-foreground">Tech Stack</h2>
          <div className="gap-sm grid grid-cols-2">
            {[
              { name: "React 19", role: "UI Framework" },
              { name: "TypeScript (strict)", role: "Type Safety" },
              { name: "Tailwind v4", role: "Styling" },
              { name: "Shadcn UI", role: "Component primitives" },
              { name: "Storybook 8", role: "Component explorer" },
              { name: "Vitest + Testing Library", role: "Testing" }
            ].map((tech) => (
              <div key={tech.name} className="border-border bg-card px-md py-sm flex items-center justify-between rounded-md border">
                <span className="typo-body text-foreground font-medium">{tech.name}</span>
                <span className="typo-caption text-muted-foreground">{tech.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="gap-md flex flex-col">
          <h2 className="typo-h2 text-foreground">Structure</h2>
          <div className="border-border bg-muted p-md typo-code text-foreground rounded-lg border font-mono">
            <pre>{`packages/ui/src/
├── components/
│   ├── atoms/          # Smallest building blocks
│   ├── molecules/      # Composed atom groups
│   ├── organisms/      # Complex sections
│   ├── layouts/        # Page layout wrappers
│   └── ui/             # Shadcn primitives
├── hooks/              # Shared hooks
├── lib/                # Utilities & tokens
├── styles/             # Global CSS & tokens
└── stories/            # Storybook documentation`}</pre>
          </div>
        </div>
      </div>
    </div>
  )
};
