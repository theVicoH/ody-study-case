import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Tokens/Gradients & Effects",
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "responsive" } }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="bg-background p-xl min-h-screen w-full">
      <div className="gap-2xl mx-auto flex max-w-[56rem] flex-col">
        <div className="gap-sm flex flex-col">
          <span className="typo-overline text-muted-foreground">Design Tokens</span>
          <h1 className="typo-h1 text-foreground">Gradients & Effects</h1>
          <p className="typo-body-lg text-muted-foreground">Brand gradient utilities and ambient effects. Use sparingly — they signal premium moments, not everyday content.</p>
        </div>

        <div className="gap-lg flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Text gradient</h2>
          </div>
          <div className="gap-md flex flex-col">
            <div className="glass-card p-xl gap-md flex flex-col items-center rounded-xl">
              <span className="typo-display text-gradient-brand">Ody Restaurant</span>
              <span className="typo-h2 text-gradient-brand">Design System</span>
              <span className="typo-h4 text-gradient-brand">violet → indigo → rose</span>
            </div>
            <pre className="typo-code text-muted-foreground bg-muted p-sm rounded-md">{"className=\"typo-h1 text-gradient-brand\"\n// Applies: bg-clip: text, color: transparent\n// Gradient: violet(304°) → indigo(277°) → rose(358°)"}</pre>
          </div>
        </div>

        <div className="gap-lg flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Ambient glow background</h2>
          </div>
          <div className="gap-md flex flex-col">
            <div className="bg-ambient-glow p-xl border-border flex h-48 items-center justify-center rounded-xl border">
              <span className="typo-h4 text-foreground glass px-lg py-md rounded-lg">bg-ambient-glow</span>
            </div>
            <pre className="typo-code text-muted-foreground bg-muted p-sm rounded-md">{"className=\"bg-ambient-glow\"\n// 3 radial gradients: violet(20% 30%), rose(80% 20%), indigo(50% 100%)\n// Use on hero sections, landing pages, modals"}</pre>
          </div>
        </div>

        <div className="gap-lg flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Grid pattern</h2>
          </div>
          <div className="gap-md flex flex-col">
            <div className="bg-grid-faint p-xl border-border bg-muted/50 flex h-48 items-center justify-center rounded-xl border">
              <span className="typo-h4 text-foreground bg-card px-lg py-md border-border rounded-lg border">bg-grid-faint</span>
            </div>
            <pre className="typo-code text-muted-foreground bg-muted p-sm rounded-md">{"className=\"bg-grid-faint\"\n// 56×56px grid, 4% opacity lines, radial mask\n// Use behind hero content, empty states"}</pre>
          </div>
        </div>

        <div className="gap-lg flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Glow effects</h2>
          </div>
          <div className="gap-md grid grid-cols-4">
            {[
              { cls: "glow-rose", label: "glow-rose", bg: "bg-accent/30" },
              { cls: "glow-violet", label: "glow-violet", bg: "bg-primary/30" },
              { cls: "glow-indigo", label: "glow-indigo", bg: "bg-[var(--chart-5)]/30" },
              { cls: "glow-blue", label: "glow-blue", bg: "bg-[var(--state-info)]/30" }
            ].map((g) => (
              <div key={g.cls} className="gap-sm flex flex-col items-center">
                <div className={`${g.cls} ${g.bg} h-20 w-full rounded-xl`} />
                <code className="typo-code text-muted-foreground text-center">{g.label}</code>
              </div>
            ))}
          </div>
          <pre className="typo-code text-muted-foreground bg-muted p-sm rounded-md">{"className=\"glow-rose\"  // box-shadow: 0 0 80px -10px var(--glow-rose)\n// Use on interactive cards, focused elements, featured content"}</pre>
        </div>
      </div>
    </div>
  )
};
