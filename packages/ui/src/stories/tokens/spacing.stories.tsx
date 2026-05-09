import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Tokens/Spacing",
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "responsive" } }
};

export default meta;

type Story = StoryObj;

const spacingTokens = [
  { token: "3xs", cssVar: "--space-3xs", rem: "0.125rem", px: "2px", tailwind: "p-3xs / gap-3xs" },
  { token: "2xs", cssVar: "--space-2xs", rem: "0.25rem", px: "4px", tailwind: "p-2xs / gap-2xs" },
  { token: "xs", cssVar: "--space-xs", rem: "0.5rem", px: "8px", tailwind: "p-xs / gap-xs" },
  { token: "sm", cssVar: "--space-sm", rem: "0.75rem", px: "12px", tailwind: "p-sm / gap-sm" },
  { token: "md", cssVar: "--space-md", rem: "1rem", px: "16px", tailwind: "p-md / gap-md" },
  { token: "lg", cssVar: "--space-lg", rem: "1.5rem", px: "24px", tailwind: "p-lg / gap-lg" },
  { token: "xl", cssVar: "--space-xl", rem: "2rem", px: "32px", tailwind: "p-xl / gap-xl" },
  { token: "2xl", cssVar: "--space-2xl", rem: "3rem", px: "48px", tailwind: "p-2xl / gap-2xl" },
  { token: "3xl", cssVar: "--space-3xl", rem: "4rem", px: "64px", tailwind: "p-3xl / gap-3xl" },
  { token: "4xl", cssVar: "--space-4xl", rem: "6rem", px: "96px", tailwind: "p-4xl / gap-4xl" }
];

export const Default: Story = {
  render: () => (
    <div className="bg-background p-xl min-h-screen w-full">
      <div className="gap-2xl mx-auto flex max-w-[56rem] flex-col">
        <div className="gap-sm flex flex-col">
          <span className="typo-overline text-muted-foreground">Design Tokens</span>
          <h1 className="typo-h1 text-foreground">Spacing</h1>
          <p className="typo-body-lg text-muted-foreground">A 10-step spacing scale from 2px to 96px. Use named tokens — never arbitrary values.</p>
        </div>

        <div className="gap-sm flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Scale</h2>
          </div>
          <div className="gap-xs flex flex-col">
            {spacingTokens.map((s) => (
              <div key={s.token} className="gap-lg border-border bg-card px-md py-sm flex items-center rounded-md border">
                <div className="w-16 shrink-0">
                  <div
                    className="bg-primary rounded-xs"
                    style={{ width: s.rem, height: "1.5rem", minWidth: "0.125rem" }}
                  />
                </div>
                <code className="typo-code text-primary w-24 shrink-0">{s.token}</code>
                <code className="typo-code text-muted-foreground w-32 shrink-0">{s.cssVar}</code>
                <code className="typo-code text-foreground w-20 shrink-0">{s.rem}</code>
                <code className="typo-code text-muted-foreground w-12 shrink-0">{s.px}</code>
                <code className="typo-code text-muted-foreground">{s.tailwind}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="gap-md flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Guidelines</h2>
          </div>
          <div className="gap-md grid grid-cols-2">
            <div className="border-border bg-card p-lg gap-sm flex flex-col rounded-lg border">
              <h3 className="typo-h5 text-foreground">Internal padding</h3>
              <ul className="gap-xs flex flex-col">
                {[
                  { usage: "Tight (badge, chip)", space: "2xs → xs" },
                  { usage: "Compact (button, input)", space: "xs → sm" },
                  { usage: "Comfortable (card)", space: "md → lg" },
                  { usage: "Spacious (page section)", space: "xl → 2xl" }
                ].map((item) => (
                  <li key={item.usage} className="typo-body-sm flex items-center justify-between">
                    <span className="text-muted-foreground">{item.usage}</span>
                    <code className="typo-code text-primary">{item.space}</code>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-border bg-card p-lg gap-sm flex flex-col rounded-lg border">
              <h3 className="typo-h5 text-foreground">Gap between elements</h3>
              <ul className="gap-xs flex flex-col">
                {[
                  { usage: "Inline items (icon + text)", space: "2xs → xs" },
                  { usage: "Form fields", space: "sm → md" },
                  { usage: "Cards in a grid", space: "md → lg" },
                  { usage: "Page sections", space: "xl → 3xl" }
                ].map((item) => (
                  <li key={item.usage} className="typo-body-sm flex items-center justify-between">
                    <span className="text-muted-foreground">{item.usage}</span>
                    <code className="typo-code text-primary">{item.space}</code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
