import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Tokens/Glass Surfaces",
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "responsive" } }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="bg-background p-xl bg-ambient-glow min-h-screen w-full">
      <div className="gap-2xl mx-auto flex max-w-[56rem] flex-col">
        <div className="gap-sm flex flex-col">
          <span className="typo-overline text-muted-foreground">Design Tokens</span>
          <h1 className="typo-h1 text-foreground">Glass Surfaces</h1>
          <p className="typo-body-lg text-muted-foreground">Glassmorphism utilities for layered depth. Works best over gradient or image backgrounds. Uses backdrop-filter for blur.</p>
        </div>

        <div className="gap-lg flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Variants</h2>
          </div>
          <div className="gap-lg grid grid-cols-2">
            {[
              {
                cls: "glass",
                title: "glass",
                desc: "Standard glass — blur(24px), 72% opacity bg. Sidebar panels, floating headers.",
                code: "className=\"glass rounded-xl p-lg\""
              },
              {
                cls: "glass-strong",
                title: "glass-strong",
                desc: "Strong glass — blur(40px), 90% opacity. Modals, critical overlays.",
                code: "className=\"glass-strong rounded-xl p-lg\""
              },
              {
                cls: "glass-card",
                title: "glass-card",
                desc: "Card glass — gradient bg, stronger border. Dashboard KPI cards.",
                code: "className=\"glass-card p-lg\""
              },
              {
                cls: "glass-primary",
                title: "glass-primary",
                desc: "Primary-tinted glass — brand color overlay with glow. Featured CTAs, focused panels.",
                code: "className=\"glass-primary rounded-xl p-lg\""
              }
            ].map((v) => (
              <div key={v.cls} className="gap-sm flex flex-col">
                <div className={`${v.cls} p-lg gap-sm flex flex-col rounded-xl`}>
                  <h3 className="typo-h5 text-foreground">{v.title}</h3>
                  <p className="typo-body-sm text-muted-foreground">{v.desc}</p>
                </div>
                <pre className="typo-code text-muted-foreground bg-muted p-sm overflow-x-auto rounded-md">{v.code}</pre>
              </div>
            ))}

            <div className="gap-sm flex flex-col">
              <div className="gap-sm flex flex-col">
                {[
                  { cls: "glass-warning", label: "glass-warning", desc: "For warning states and alerts" },
                  { cls: "glass-error", label: "glass-error", desc: "For error states and destructive alerts" },
                  { cls: "glass-info", label: "glass-info", desc: "For informational banners" }
                ].map((v) => (
                  <div key={v.cls} className={`${v.cls} p-md gap-md flex items-center rounded-xl`}>
                    <div>
                      <span className="typo-caption text-foreground block font-medium">{v.label}</span>
                      <span className="typo-caption text-muted-foreground">{v.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="gap-md flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Fallback</h2>
          </div>
          <div className="glass-card p-md rounded-lg">
            <p className="typo-body-sm text-muted-foreground">
              Browsers without backdrop-filter support fall back to <code className="typo-code bg-muted px-xs rounded-sm">oklch(0.16 0.01 286 / 0.92)</code> — still visually coherent.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
};
