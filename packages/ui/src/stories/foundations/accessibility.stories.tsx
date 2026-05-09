import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Foundations/Accessibility",
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "responsive" } }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="bg-background p-xl min-h-screen w-full">
      <div className="gap-2xl mx-auto flex max-w-[56rem] flex-col">
        <div className="gap-md flex flex-col">
          <span className="typo-overline text-muted-foreground">Accessibility</span>
          <h1 className="typo-h1 text-foreground">WCAG AA Compliance</h1>
          <p className="typo-body-lg text-muted-foreground">
            All components meet WCAG 2.1 AA standards. Accessibility is baked into the token system, not bolted on.
          </p>
        </div>

        <div className="gap-lg flex flex-col">
          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">Color contrast</h2>
            <div className="gap-sm grid grid-cols-2">
              {[
                { bg: "bg-primary", text: "text-primary-foreground", pair: "primary / primary-foreground", ratio: "5.4:1 ✓ AA" },
                { bg: "bg-accent", text: "text-accent-foreground", pair: "accent / accent-foreground", ratio: "6.6:1 ✓ AA" },
                { bg: "bg-background", text: "text-foreground", pair: "background / foreground", ratio: "≥ 12:1 ✓ AAA" },
                { bg: "bg-muted", text: "text-muted-foreground", pair: "muted / muted-foreground", ratio: "4.6:1 ✓ AA" }
              ].map((item) => (
                <div key={item.pair} className={`${item.bg} p-lg gap-xs flex flex-col rounded-lg`}>
                  <span className={`${item.text} typo-body font-medium`}>{item.pair}</span>
                  <span className={`${item.text} typo-caption opacity-80`}>Contrast ratio: {item.ratio}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">Focus management</h2>
            <p className="typo-body text-muted-foreground">All interactive elements have a visible focus ring using the <code className="typo-code bg-muted px-xs rounded-sm">ring</code> token. Focus rings use 2px offset for visibility.</p>
            <div className="border-border bg-muted p-md typo-code text-foreground rounded-lg border">
              <pre>{":focus-visible {\n  outline: 2px solid var(--ring);\n  outline-offset: 2px;\n}"}</pre>
            </div>
          </div>

          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">Keyboard navigation</h2>
            <div className="gap-sm flex flex-col">
              {[
                { keys: "Tab / Shift+Tab", action: "Move focus forward / backward" },
                { keys: "Enter / Space", action: "Activate button or toggle" },
                { keys: "Escape", action: "Close modal, dropdown, or sheet" },
                { keys: "Arrow keys", action: "Navigate within tabs, select, menu" }
              ].map((item) => (
                <div key={item.keys} className="gap-md border-border bg-card px-md py-sm flex items-center rounded-md border">
                  <code className="typo-code text-primary bg-muted px-sm py-xs min-w-40 rounded-sm">{item.keys}</code>
                  <span className="typo-body-sm text-foreground">{item.action}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">Touch targets</h2>
            <p className="typo-body text-muted-foreground">Minimum touch target: 44×44px on mobile. All button size variants meet this requirement when rendered on mobile viewports.</p>
          </div>

          <div className="gap-md flex flex-col">
            <h2 className="typo-h2 text-foreground">Semantic HTML</h2>
            <div className="gap-sm grid grid-cols-2">
              {[
                { element: "<button>", usage: "All clickable actions" },
                { element: "<nav>", usage: "Navigation regions" },
                { element: "<main>", usage: "Primary page content" },
                { element: "<aside>", usage: "Sidebar content" },
                { element: "<header>", usage: "Page/section header" },
                { element: "<dialog>", usage: "Modal dialogs" }
              ].map((item) => (
                <div key={item.element} className="gap-md border-border bg-card px-md py-sm flex items-center rounded-md border">
                  <code className="typo-code text-accent bg-muted px-sm py-xs rounded-sm">{item.element}</code>
                  <span className="typo-body-sm text-muted-foreground">{item.usage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
