import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Tokens/Typography",
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "responsive" } }
};

export default meta;

type Story = StoryObj;

const typeScale = [
  { utility: "typo-display", label: "Display", size: "3.75rem", weight: "700", lineHeight: "1.1", font: "Space Grotesk", usage: "Hero sections, marketing headers" },
  { utility: "typo-h1", label: "Heading 1", size: "2.25rem", weight: "700", lineHeight: "1.15", font: "Space Grotesk", usage: "Page titles" },
  { utility: "typo-h2", label: "Heading 2", size: "1.875rem", weight: "700", lineHeight: "1.2", font: "Space Grotesk", usage: "Section titles" },
  { utility: "typo-h3", label: "Heading 3", size: "1.5rem", weight: "600", lineHeight: "1.25", font: "Space Grotesk", usage: "Card titles, subsections" },
  { utility: "typo-h4", label: "Heading 4", size: "1.25rem", weight: "600", lineHeight: "1.3", font: "Space Grotesk", usage: "Widget headers" },
  { utility: "typo-h5", label: "Heading 5", size: "1.125rem", weight: "600", lineHeight: "1.35", font: "Inter", usage: "Form section titles" },
  { utility: "typo-body-lg", label: "Body Large", size: "1.125rem", weight: "400", lineHeight: "1.6", font: "Inter", usage: "Lead paragraphs" },
  { utility: "typo-body", label: "Body", size: "1rem", weight: "400", lineHeight: "1.5", font: "Inter", usage: "Default body text" },
  { utility: "typo-body-sm", label: "Body Small", size: "0.875rem", weight: "400", lineHeight: "1.5", font: "Inter", usage: "Secondary text, descriptions" },
  { utility: "typo-caption", label: "Caption", size: "0.75rem", weight: "500", lineHeight: "1.4", font: "Inter", usage: "Labels, metadata" },
  { utility: "typo-overline", label: "Overline", size: "0.75rem", weight: "600", lineHeight: "1.4", font: "Inter", usage: "Section labels (UPPERCASE)" },
  { utility: "typo-button", label: "Button", size: "0.875rem", weight: "600", lineHeight: "1.2", font: "Inter", usage: "Button labels" },
  { utility: "typo-code", label: "Code", size: "0.875rem", weight: "400", lineHeight: "1.5", font: "Monospace", usage: "Code snippets, tokens" }
];

export const TypeScale: Story = {
  render: () => (
    <div className="bg-background p-xl min-h-screen w-full">
      <div className="gap-2xl mx-auto flex max-w-[64rem] flex-col">
        <div className="gap-sm flex flex-col">
          <span className="typo-overline text-muted-foreground">Design Tokens</span>
          <h1 className="typo-h1 text-foreground">Typography</h1>
          <p className="typo-body-lg text-muted-foreground">Two font families: Space Grotesk for headings (geometric, premium) and Inter for body text (legible, neutral).</p>
        </div>

        <div className="gap-sm flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Type Scale</h2>
          </div>
          <div className="flex flex-col">
            {typeScale.map((item, i) => (
              <div key={item.utility} className={`gap-xl p-md flex items-baseline ${i % 2 === 0 ? "bg-muted/30" : ""} rounded-md`}>
                <div className={`${item.utility} text-foreground min-w-0 flex-1`} style={{ lineHeight: item.lineHeight }}>
                  {item.label}
                </div>
                <div className="gap-lg flex shrink-0 items-center">
                  <span className="typo-code text-muted-foreground w-20 text-right">{item.size}</span>
                  <span className="typo-code text-muted-foreground w-12 text-right">{item.weight}</span>
                  <span className="typo-caption text-primary w-40 font-mono">{item.utility}</span>
                  <span className="typo-caption text-muted-foreground w-32">{item.font}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gap-md flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Font Families</h2>
          </div>
          <div className="gap-md grid grid-cols-2">
            <div className="border-border bg-card p-lg gap-md flex flex-col rounded-lg border">
              <div>
                <h3 className="typo-h4 text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Space Grotesk</h3>
                <p className="typo-body-sm text-muted-foreground">var(--font-heading)</p>
              </div>
              <p className="typo-body-lg text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                abcdefghijklmnopqrstuvwxyz<br />
                0123456789
              </p>
              <p className="typo-body-sm text-muted-foreground">Used for: headings, display text, brand elements</p>
            </div>
            <div className="border-border bg-card p-lg gap-md flex flex-col rounded-lg border">
              <div>
                <h3 className="typo-h4 text-foreground">Inter</h3>
                <p className="typo-body-sm text-muted-foreground">var(--font-sans)</p>
              </div>
              <p className="typo-body-lg text-foreground">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                abcdefghijklmnopqrstuvwxyz<br />
                0123456789
              </p>
              <p className="typo-body-sm text-muted-foreground">Used for: body text, UI labels, captions, code</p>
            </div>
          </div>
        </div>

        <div className="gap-md flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Real-world example</h2>
          </div>
          <div className="border-border bg-card p-xl gap-md flex flex-col rounded-lg border">
            <span className="typo-overline text-muted-foreground">Restaurant Dashboard</span>
            <h1 className="typo-h2 text-foreground">Today&apos;s Revenue</h1>
            <p className="typo-body text-muted-foreground">Friday, May 9, 2026 — Service closes at 23:00</p>
            <div className="gap-sm flex items-baseline">
              <span className="typo-display text-foreground">€4,280</span>
              <span className="typo-body text-primary">+12.4%</span>
            </div>
            <p className="typo-body-sm text-muted-foreground">Compared to last Friday (€3,808). Peak hour: 20:00–21:00.</p>
            <span className="typo-caption text-muted-foreground">Updated 2 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  )
};

export const Default: Story = TypeScale;
