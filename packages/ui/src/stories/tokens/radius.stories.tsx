import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Tokens/Radius",
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "responsive" } }
};

export default meta;

type Story = StoryObj;

const radiusTokens = [
  { name: "none", cssVar: "--radius-none", approx: "0px", tailwind: "rounded-none", usage: "Tables, strict grid elements" },
  { name: "xs", cssVar: "--radius-xs", approx: "≈ 4px", tailwind: "rounded-xs", usage: "Tags, small badges" },
  { name: "sm", cssVar: "--radius-sm", approx: "≈ 8px", tailwind: "rounded-sm", usage: "Inputs, inline elements" },
  { name: "md", cssVar: "--radius-md", approx: "≈ 11px", tailwind: "rounded-md", usage: "Buttons, dropdowns" },
  { name: "lg", cssVar: "--radius-lg", approx: "14px", tailwind: "rounded-lg", usage: "Cards, panels (base radius)" },
  { name: "xl", cssVar: "--radius-xl", approx: "≈ 20px", tailwind: "rounded-xl", usage: "Modals, dialogs" },
  { name: "2xl", cssVar: "--radius-2xl", approx: "≈ 25px", tailwind: "rounded-2xl", usage: "Featured cards, hero elements" },
  { name: "3xl", cssVar: "--radius-3xl", approx: "≈ 31px", tailwind: "rounded-3xl", usage: "Large decorative containers" },
  { name: "4xl", cssVar: "--radius-4xl", approx: "≈ 36px", tailwind: "rounded-4xl", usage: "Decorative blobs" },
  { name: "5xl", cssVar: "--radius-5xl", approx: "≈ 47px", tailwind: "rounded-5xl", usage: "Large decorative shapes" },
  { name: "full", cssVar: "--radius-full", approx: "9999px", tailwind: "rounded-full", usage: "Avatars, pills, toggles" }
];

export const Default: Story = {
  render: () => (
    <div className="bg-background p-xl min-h-screen w-full">
      <div className="gap-2xl mx-auto flex max-w-[56rem] flex-col">
        <div className="gap-sm flex flex-col">
          <span className="typo-overline text-muted-foreground">Design Tokens</span>
          <h1 className="typo-h1 text-foreground">Border Radius</h1>
          <p className="typo-body-lg text-muted-foreground">11 radius steps from sharp to pill. The base radius is 0.875rem — all steps multiply from it.</p>
        </div>

        <div className="gap-sm flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Scale</h2>
          </div>
          <div className="gap-sm grid grid-cols-2">
            {radiusTokens.map((r) => (
              <div key={r.name} className="gap-md border-border bg-card p-md flex items-center rounded-lg border">
                <div
                  className="bg-primary/20 border-primary/40 shrink-0 border"
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: r.name === "none" ? "0" : r.name === "full" ? "9999px" : `var(--radius-${r.name})`
                  }}
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <code className="typo-code text-primary">{r.tailwind}</code>
                  <code className="typo-code text-muted-foreground">{r.cssVar}</code>
                  <span className="typo-caption text-muted-foreground">{r.approx} — {r.usage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gap-md flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">By component type</h2>
          </div>
          <div className="gap-sm grid grid-cols-3">
            {[
              { component: "Button", radius: "rounded-md", demo: "Click me", bg: "bg-primary text-primary-foreground px-md py-sm" },
              { component: "Input", radius: "rounded-sm", demo: "Type here...", bg: "bg-input border border-border text-muted-foreground px-md py-sm" },
              { component: "Card", radius: "rounded-lg", demo: "Card content", bg: "bg-card border border-border p-lg text-foreground" },
              { component: "Badge", radius: "rounded-xs", demo: "Active", bg: "bg-primary/20 text-primary px-sm py-2xs" },
              { component: "Modal", radius: "rounded-xl", demo: "Dialog content", bg: "bg-card border border-border p-lg text-foreground" },
              { component: "Avatar", radius: "rounded-full", demo: "VH", bg: "bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center" }
            ].map((item) => (
              <div key={item.component} className="gap-sm border-border bg-muted/30 p-md flex flex-col rounded-lg border">
                <span className="typo-caption text-muted-foreground">{item.component}</span>
                <div className={`${item.radius} ${item.bg} typo-body-sm flex items-center justify-center`}>
                  {item.demo}
                </div>
                <code className="typo-code text-primary text-center">{item.radius}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};
