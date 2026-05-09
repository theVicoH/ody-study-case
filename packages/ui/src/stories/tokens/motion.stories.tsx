"use client";
import React, { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Tokens/Motion",
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "responsive" } }
};

export default meta;

type Story = StoryObj;

const durations = [
  { name: "instant", cssVar: "--duration-instant", value: "0ms", usage: "State toggles with no animation" },
  { name: "fast", cssVar: "--duration-fast", value: "150ms", usage: "Hover states, tooltips, small reveals" },
  { name: "base", cssVar: "--duration-base", value: "250ms", usage: "Default transitions, panel reveals" },
  { name: "slow", cssVar: "--duration-slow", value: "400ms", usage: "Modals, page transitions" },
  { name: "slower", cssVar: "--duration-slower", value: "600ms", usage: "Onboarding, emphasis animations" }
];

const eases = [
  { name: "linear", cssVar: "--ease-linear", desc: "Mechanical, progress bars" },
  { name: "in", cssVar: "--ease-in", desc: "Exits — elements leaving screen" },
  { name: "out", cssVar: "--ease-out", desc: "Entrances — elements appearing" },
  { name: "in-out", cssVar: "--ease-in-out", desc: "Movement — dragging, shifting" },
  { name: "emphasized", cssVar: "--ease-emphasized", desc: "Premium deceleration for key UI" },
  { name: "bounce", cssVar: "--ease-bounce", desc: "Playful feedback, success states" }
];

const DemoBox = ({ duration, ease }: { duration: string; ease: string }): React.JSX.Element => {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      className="border-border bg-muted p-md gap-sm flex w-full cursor-pointer flex-col items-center rounded-lg border"
      onClick={() => setActive((v) => !v)}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div
        className="bg-primary h-8 w-8 rounded-md"
        style={{
          transform: active ? "translateX(80px) scale(1.2)" : "translateX(0) scale(1)",
          transition: `transform ${duration} var(${ease})`
        }}
      />
      <span className="typo-caption text-muted-foreground">Click to animate</span>
    </button>
  );
};

export const Default: Story = {
  render: () => (
    <div className="bg-background p-xl min-h-screen w-full">
      <div className="gap-2xl mx-auto flex max-w-[56rem] flex-col">
        <div className="gap-sm flex flex-col">
          <span className="typo-overline text-muted-foreground">Design Tokens</span>
          <h1 className="typo-h1 text-foreground">Motion</h1>
          <p className="typo-body-lg text-muted-foreground">Duration and easing tokens for consistent, purposeful animation. Use CSS variables via Tailwind duration and ease utilities.</p>
        </div>

        <div className="gap-md flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Durations</h2>
          </div>
          <div className="gap-sm flex flex-col">
            {durations.map((d) => (
              <div key={d.name} className="gap-lg border-border bg-card px-md py-sm flex items-center rounded-md border">
                <code className="typo-code text-primary w-32 shrink-0">{d.cssVar}</code>
                <code className="typo-code text-foreground w-16 shrink-0">{d.value}</code>
                <span className="typo-body-sm text-muted-foreground">{d.usage}</span>
                <div className="ml-auto">
                  <div
                    className="bg-primary h-1 rounded-full"
                    style={{ width: d.name === "instant" ? "4px" : `${parseInt(d.value) / 6}px`, minWidth: "4px" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gap-md flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Easing curves</h2>
          </div>
          <div className="gap-sm grid grid-cols-2">
            {eases.map((e) => (
              <div key={e.name} className="border-border bg-card px-md py-sm gap-xs flex flex-col rounded-md border">
                <code className="typo-code text-primary">{e.cssVar}</code>
                <span className="typo-body-sm text-foreground font-medium">{e.name}</span>
                <span className="typo-caption text-muted-foreground">{e.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="gap-md flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Interactive demos</h2>
            <p className="typo-body-sm text-muted-foreground mt-xs">Click each box to see the easing in action with base (250ms) duration.</p>
          </div>
          <div className="gap-md grid grid-cols-3">
            {eases.map((e) => (
              <div key={e.name} className="gap-sm flex flex-col">
                <span className="typo-caption text-muted-foreground text-center">{e.name}</span>
                <DemoBox duration="250ms" ease={e.cssVar} />
              </div>
            ))}
          </div>
        </div>

        <div className="border-border bg-muted p-lg rounded-lg border">
          <h3 className="typo-h5 text-foreground mb-sm">Tailwind usage</h3>
          <pre className="typo-code text-foreground">{"/* Duration */\nclassName=\"transition-all duration-base ease-out\"\n\n/* Custom via CSS var */\nstyle={{ transition: `opacity var(--duration-fast) var(--ease-out)` }}"}</pre>
        </div>
      </div>
    </div>
  )
};
