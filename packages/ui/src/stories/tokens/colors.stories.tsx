import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Tokens/Colors",
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "responsive" } }
};

export default meta;

type Story = StoryObj;

interface ColorSwatchProps {
  bgClass: string;
  textClass: string;
  name: string;
  cssVar: string;
  tailwindClass: string;
}

const ColorSwatch = ({ bgClass, textClass: _textClass, name, cssVar, tailwindClass }: ColorSwatchProps): React.JSX.Element => (
  <div className="border-border flex flex-col overflow-hidden rounded-lg border">
    <div className={`${bgClass} h-20 w-full`} />
    <div className="bg-card p-sm flex flex-col gap-0.5">
      <span className="typo-caption text-foreground font-medium">{name}</span>
      <span className="typo-caption text-muted-foreground font-mono">{cssVar}</span>
      <span className="typo-caption text-primary font-mono">{tailwindClass}</span>
    </div>
  </div>
);

const Section = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }): React.JSX.Element => (
  <div className="gap-md flex flex-col">
    <div className="border-border pb-sm border-b">
      <h2 className="typo-h3 text-foreground">{title}</h2>
      {description && <p className="typo-body-sm text-muted-foreground mt-xs">{description}</p>}
    </div>
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <div className="bg-background p-xl min-h-screen w-full">
      <div className="gap-2xl mx-auto flex max-w-[64rem] flex-col">
        <div className="gap-sm flex flex-col">
          <span className="typo-overline text-muted-foreground">Design Tokens</span>
          <h1 className="typo-h1 text-foreground">Colors</h1>
          <p className="typo-body-lg text-muted-foreground">Semantic color tokens using OKLCH for perceptual uniformity. All tokens adapt to light and dark mode.</p>
        </div>

        <Section title="Brand" description="Primary and accent colors — the visual identity of Ody.">
          <div className="gap-sm grid grid-cols-4">
            <ColorSwatch bgClass="bg-primary" textClass="text-primary-foreground" name="Primary" cssVar="--primary" tailwindClass="bg-primary" />
            <ColorSwatch bgClass="bg-primary/20" textClass="text-primary" name="Primary / 20%" cssVar="--primary / 0.2" tailwindClass="bg-primary/20" />
            <ColorSwatch bgClass="bg-accent" textClass="text-accent-foreground" name="Accent" cssVar="--accent" tailwindClass="bg-accent" />
            <ColorSwatch bgClass="bg-accent/20" textClass="text-accent" name="Accent / 20%" cssVar="--accent / 0.2" tailwindClass="bg-accent/20" />
          </div>
        </Section>

        <Section title="Surfaces" description="Background and card colors for layered depth.">
          <div className="gap-sm grid grid-cols-4">
            <ColorSwatch bgClass="bg-background border border-border" textClass="text-foreground" name="Background" cssVar="--background" tailwindClass="bg-background" />
            <ColorSwatch bgClass="bg-card" textClass="text-card-foreground" name="Card" cssVar="--card" tailwindClass="bg-card" />
            <ColorSwatch bgClass="bg-popover" textClass="text-popover-foreground" name="Popover" cssVar="--popover" tailwindClass="bg-popover" />
            <ColorSwatch bgClass="bg-muted" textClass="text-muted-foreground" name="Muted" cssVar="--muted" tailwindClass="bg-muted" />
          </div>
        </Section>

        <Section title="Semantic" description="Status and interaction colors with clear intent.">
          <div className="gap-sm grid grid-cols-4">
            <ColorSwatch bgClass="bg-secondary" textClass="text-secondary-foreground" name="Secondary" cssVar="--secondary" tailwindClass="bg-secondary" />
            <ColorSwatch bgClass="bg-destructive" textClass="text-primary-foreground" name="Destructive" cssVar="--destructive" tailwindClass="bg-destructive" />
            <ColorSwatch bgClass="bg-border" textClass="text-foreground" name="Border" cssVar="--border" tailwindClass="border-border" />
            <ColorSwatch bgClass="bg-ring" textClass="text-primary-foreground" name="Ring" cssVar="--ring" tailwindClass="ring-ring" />
          </div>
        </Section>

        <Section title="State" description="Warning, error, and info for contextual feedback.">
          <div className="gap-sm grid grid-cols-3">
            {[
              { name: "Warning", cssVar: "--state-warning", bg: "bg-[oklch(0.78_0.14_80)]" },
              { name: "Error", cssVar: "--state-error", bg: "bg-[oklch(0.68_0.20_27)]" },
              { name: "Info", cssVar: "--state-info", bg: "bg-[oklch(0.65_0.17_248)]" }
            ].map((s) => (
              <div key={s.name} className="border-border flex flex-col overflow-hidden rounded-lg border">
                <div className={`${s.bg} h-20 w-full`} />
                <div className="bg-card p-sm flex flex-col gap-0.5">
                  <span className="typo-caption text-foreground font-medium">{s.name}</span>
                  <span className="typo-caption text-muted-foreground font-mono">{s.cssVar}</span>
                  <span className="typo-caption text-primary font-mono">text-[var({s.cssVar})]</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Data Visualization" description="Chart colors following the brand gradient: rose → pink → fuchsia → violet → indigo.">
          <div className="gap-sm grid grid-cols-5">
            {[
              { name: "Chart 1", cssVar: "--chart-1", bg: "bg-[var(--chart-1)]" },
              { name: "Chart 2", cssVar: "--chart-2", bg: "bg-[var(--chart-2)]" },
              { name: "Chart 3", cssVar: "--chart-3", bg: "bg-[var(--chart-3)]" },
              { name: "Chart 4", cssVar: "--chart-4", bg: "bg-[var(--chart-4)]" },
              { name: "Chart 5", cssVar: "--chart-5", bg: "bg-[var(--chart-5)]" }
            ].map((c) => (
              <div key={c.name} className="border-border flex flex-col overflow-hidden rounded-lg border">
                <div className={`${c.bg} h-16 w-full`} />
                <div className="bg-card p-sm">
                  <span className="typo-caption text-foreground block font-medium">{c.name}</span>
                  <span className="typo-caption text-muted-foreground font-mono">{c.cssVar}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Usage guidelines">
          <div className="gap-md grid grid-cols-2">
            <div className="border-border bg-card p-lg gap-sm flex flex-col rounded-lg border">
              <span className="typo-overline text-primary">Do</span>
              <ul className="gap-xs flex flex-col">
                {[
                  "Use bg-primary for primary CTAs only",
                  "Use bg-muted for hover states and backgrounds",
                  "Use text-muted-foreground for secondary text",
                  "Use bg-destructive for delete/error actions"
                ].map((item) => (
                  <li key={item} className="gap-xs typo-body-sm text-foreground flex items-start">
                    <span className="text-primary">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-border bg-card p-lg gap-sm flex flex-col rounded-lg border">
              <span className="typo-overline text-destructive">Don&apos;t</span>
              <ul className="gap-xs flex flex-col">
                {[
                  "Use raw colors like bg-blue-500",
                  "Use bg-[#hexcode] inline values",
                  "Mix brand color with semantic (accent for errors)",
                  "Use primary for body text"
                ].map((item) => (
                  <li key={item} className="gap-xs typo-body-sm text-muted-foreground flex items-start">
                    <span className="text-destructive">✗</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
};
