import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Tokens/Elevation",
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "responsive" } }
};

export default meta;

type Story = StoryObj;

const elevationTokens = [
  { name: "xs", cssVar: "--elevation-xs", tailwind: "shadow-xs", usage: "Subtle separation, hover state on flat elements" },
  { name: "sm", cssVar: "--elevation-sm", tailwind: "shadow-sm", usage: "Cards at rest, inputs" },
  { name: "md", cssVar: "--elevation-md", tailwind: "shadow-md", usage: "Dropdowns, popovers" },
  { name: "lg", cssVar: "--elevation-lg", tailwind: "shadow-lg", usage: "Floating panels, navigation" },
  { name: "xl", cssVar: "--elevation-xl", tailwind: "shadow-xl", usage: "Modals, dialogs" },
  { name: "primary", cssVar: "--elevation-primary", tailwind: "shadow-primary", usage: "Primary CTA highlight, focused interactive element" }
];

export const Default: Story = {
  render: () => (
    <div className="bg-background p-xl min-h-screen w-full">
      <div className="gap-2xl mx-auto flex max-w-[56rem] flex-col">
        <div className="gap-sm flex flex-col">
          <span className="typo-overline text-muted-foreground">Design Tokens</span>
          <h1 className="typo-h1 text-foreground">Elevation & Shadows</h1>
          <p className="typo-body-lg text-muted-foreground">Six elevation levels to communicate depth and z-index intent. Dark mode uses higher opacity for the same visual weight.</p>
        </div>

        <div className="gap-lg flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Elevation scale</h2>
          </div>
          <div className="gap-xl p-xl grid grid-cols-2">
            {elevationTokens.map((e) => (
              <div key={e.name} className="gap-md flex flex-col items-center">
                <div
                  className="bg-card flex h-24 w-full items-center justify-center rounded-lg"
                  style={{ boxShadow: `var(${e.cssVar})` }}
                >
                  <span className="typo-code text-muted-foreground">{e.tailwind}</span>
                </div>
                <div className="gap-xs flex w-full flex-col">
                  <code className="typo-code text-primary">{e.cssVar}</code>
                  <span className="typo-body-sm text-muted-foreground">{e.usage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gap-md flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Usage guidelines</h2>
          </div>
          <div className="gap-md grid grid-cols-2">
            <div className="border-border bg-card p-lg gap-sm flex flex-col rounded-lg border">
              <span className="typo-overline text-primary">Do</span>
              <ul className="gap-xs flex flex-col">
                {[
                  "Use higher elevation for elements closer to user",
                  "shadow-primary on focused primary buttons",
                  "shadow-xl exclusively for modals and full-screen overlays",
                  "Combine glass with shadow-md for floating panels"
                ].map((d) => (
                  <li key={d} className="gap-xs typo-body-sm text-foreground flex items-start">
                    <span className="text-primary shrink-0">✓</span>{d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-border bg-card p-lg gap-sm flex flex-col rounded-lg border">
              <span className="typo-overline text-destructive">Don't</span>
              <ul className="gap-xs flex flex-col">
                {[
                  "Stack multiple shadows with CSS box-shadow",
                  "Use shadow-xl on small inline elements",
                  "Apply shadow-primary to non-interactive elements",
                  "Add arbitrary box-shadow values — use tokens"
                ].map((d) => (
                  <li key={d} className="gap-xs typo-body-sm text-muted-foreground flex items-start">
                    <span className="text-destructive shrink-0">✗</span>{d}
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
