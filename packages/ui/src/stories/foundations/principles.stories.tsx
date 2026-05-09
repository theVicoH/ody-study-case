import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Principles",
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "responsive" } }
};

export default meta;

type Story = StoryObj;

const principles = [
  {
    number: "01",
    title: "Clarity first",
    description: "Every UI decision must serve comprehension. Restaurant operators are busy — the interface must communicate intent instantly without ambiguity.",
    dos: ["Use clear labels and concise copy", "Prioritize data over decoration", "Maintain strong visual hierarchy"],
    donts: ["Hide actions in nested menus", "Use icon-only buttons without tooltip", "Overwhelm with information density"]
  },
  {
    number: "02",
    title: "Consistency",
    description: "Identical patterns for identical actions. Users build muscle memory — breaking consistency forces re-learning and erodes trust.",
    dos: ["Use the same component for the same action", "Maintain consistent spacing rhythms", "Follow token naming conventions"],
    donts: ["Create one-off styles outside tokens", "Mix component variants for similar contexts", "Override design tokens inline"]
  },
  {
    number: "03",
    title: "Premium feel",
    description: "SaaS products that feel premium command higher perceived value. Motion, micro-interactions, and visual polish signal quality.",
    dos: ["Use motion tokens for transitions", "Apply glass morphism sparingly for depth", "Use glow effects on interactive highlights"],
    donts: ["Animate everything (creates noise)", "Use harsh shadows or flat design indiscriminately", "Sacrifice function for aesthetics"]
  },
  {
    number: "04",
    title: "Accessibility",
    description: "WCAG AA minimum. Keyboard navigable, screen reader compatible, touch-friendly targets. Accessibility is not optional.",
    dos: ["Maintain 4.5:1 contrast for text", "Provide focus-visible states on all interactive elements", "Use semantic HTML"],
    donts: ["Use color as the only state indicator", "Create targets smaller than 44×44px on mobile", "Rely solely on placeholder text for labels"]
  }
];

export const Default: Story = {
  render: () => (
    <div className="bg-background p-xl min-h-screen w-full">
      <div className="gap-2xl mx-auto flex max-w-[56rem] flex-col">
        <div className="gap-md flex flex-col">
          <span className="typo-overline text-muted-foreground">Design Principles</span>
          <h1 className="typo-h1 text-foreground">What we stand for</h1>
          <p className="typo-body-lg text-muted-foreground">Four principles guide every design decision in the Ody UI system.</p>
        </div>

        <div className="gap-lg flex flex-col">
          {principles.map((p) => (
            <div key={p.number} className="glass-card p-xl gap-lg flex flex-col">
              <div className="gap-lg flex items-start">
                <span className="typo-display text-primary/30 leading-none font-bold">{p.number}</span>
                <div className="gap-sm flex flex-col">
                  <h2 className="typo-h3 text-foreground">{p.title}</h2>
                  <p className="typo-body text-muted-foreground">{p.description}</p>
                </div>
              </div>
              <div className="gap-md grid grid-cols-2">
                <div className="gap-sm flex flex-col">
                  <span className="typo-overline text-primary">Do</span>
                  <ul className="gap-xs flex flex-col">
                    {p.dos.map((d) => (
                      <li key={d} className="gap-xs typo-body-sm text-foreground flex items-start">
                        <span className="text-primary mt-0.5">✓</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="gap-sm flex flex-col">
                  <span className="typo-overline text-destructive">Don&apos;t</span>
                  <ul className="gap-xs flex flex-col">
                    {p.donts.map((d) => (
                      <li key={d} className="gap-xs typo-body-sm text-muted-foreground flex items-start">
                        <span className="text-destructive mt-0.5">✗</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};
