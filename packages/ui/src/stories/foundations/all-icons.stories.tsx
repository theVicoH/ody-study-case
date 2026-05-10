"use client";
import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

import { ArrowDownIcon } from "@/components/icons/arrow-down/arrow-down.icon";
import { ArrowDownUpIcon } from "@/components/icons/arrow-down-up/arrow-down-up.icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left/arrow-left.icon";
import { ArrowRightIcon } from "@/components/icons/arrow-right/arrow-right.icon";
import { ArrowUpIcon } from "@/components/icons/arrow-up/arrow-up.icon";
import { BookmarkCheckIcon } from "@/components/icons/bookmark-check/bookmark-check.icon";
import { ChartLineIcon } from "@/components/icons/chart-line/chart-line.icon";
import { EyeIcon } from "@/components/icons/eye/eye.icon";
import { HouseIcon } from "@/components/icons/home/home.icon";
import { MaximizeIcon } from "@/components/icons/maximize/maximize.icon";
import { MenuIcon } from "@/components/icons/menu/menu.icon";
import { MinimizeIcon } from "@/components/icons/minimize/minimize.icon";
import { PencilIcon } from "@/components/icons/pencil/pencil.icon";
import { PlusIcon } from "@/components/icons/plus/plus.icon";
import { SearchIcon } from "@/components/icons/search/search.icon";
import { SettingsIcon } from "@/components/icons/settings/settings.icon";
import { SlidersHorizontalIcon } from "@/components/icons/sliders-horizontal/sliders-horizontal.icon";
import { TrashIcon } from "@/components/icons/trash/trash.icon";
import { UsersIcon } from "@/components/icons/users/users.icon";
import { XIcon } from "@/components/icons/x/x.icon";

const meta: Meta = {
  title: "Foundations/All Icons",
  parameters: { layout: "fullscreen", viewport: { defaultViewport: "responsive" } }
};

export default meta;

type Story = StoryObj;

const ICON_SIZE = 22;

const icons = [
  { name: "ArrowDownIcon", path: "icons/arrow-down/arrow-down.icon", component: <ArrowDownIcon size={ICON_SIZE} /> },
  { name: "ArrowDownUpIcon", path: "icons/arrow-down-up/arrow-down-up.icon", component: <ArrowDownUpIcon size={ICON_SIZE} /> },
  { name: "ArrowLeftIcon", path: "icons/arrow-left/arrow-left.icon", component: <ArrowLeftIcon size={ICON_SIZE} /> },
  { name: "ArrowRightIcon", path: "icons/arrow-right/arrow-right.icon", component: <ArrowRightIcon size={ICON_SIZE} /> },
  { name: "ArrowUpIcon", path: "icons/arrow-up/arrow-up.icon", component: <ArrowUpIcon size={ICON_SIZE} /> },
  { name: "BookmarkCheckIcon", path: "icons/bookmark-check/bookmark-check.icon", component: <BookmarkCheckIcon size={ICON_SIZE} /> },
  { name: "ChartLineIcon", path: "icons/chart-line/chart-line.icon", component: <ChartLineIcon size={ICON_SIZE} /> },
  { name: "EyeIcon", path: "icons/eye/eye.icon", component: <EyeIcon size={ICON_SIZE} /> },
  { name: "HouseIcon", path: "icons/home/home.icon", component: <HouseIcon size={ICON_SIZE} /> },
  { name: "MaximizeIcon", path: "icons/maximize/maximize.icon", component: <MaximizeIcon size={ICON_SIZE} /> },
  { name: "MenuIcon", path: "icons/menu/menu.icon", component: <MenuIcon size={ICON_SIZE} /> },
  { name: "MinimizeIcon", path: "icons/minimize/minimize.icon", component: <MinimizeIcon size={ICON_SIZE} /> },
  { name: "PencilIcon", path: "icons/pencil/pencil.icon", component: <PencilIcon size={ICON_SIZE} /> },
  { name: "PlusIcon", path: "icons/plus/plus.icon", component: <PlusIcon size={ICON_SIZE} /> },
  { name: "SearchIcon", path: "icons/search/search.icon", component: <SearchIcon size={ICON_SIZE} /> },
  { name: "SettingsIcon", path: "icons/settings/settings.icon", component: <SettingsIcon size={ICON_SIZE} /> },
  { name: "SlidersHorizontalIcon", path: "icons/sliders-horizontal/sliders-horizontal.icon", component: <SlidersHorizontalIcon size={ICON_SIZE} /> },
  { name: "TrashIcon", path: "icons/trash/trash.icon", component: <TrashIcon size={ICON_SIZE} /> },
  { name: "UsersIcon", path: "icons/users/users.icon", component: <UsersIcon size={ICON_SIZE} /> },
  { name: "XIcon", path: "icons/x/x.icon", component: <XIcon size={ICON_SIZE} /> }
];

export const Default: Story = {
  render: () => (
    <div className="bg-background p-xl min-h-screen w-full">
      <div className="gap-2xl mx-auto flex max-w-[64rem] flex-col">
        <div className="gap-sm flex flex-col">
          <span className="typo-overline text-muted-foreground">Foundations</span>
          <h1 className="typo-h1 text-foreground">Icons</h1>
          <p className="typo-body-lg text-muted-foreground">
            {icons.length} animated SVG icons built with Motion. Each animates on hover — pass{" "}
            <code className="typo-code bg-muted px-xs rounded-sm">isAnimated={"{false}"}</code>{" "}
            to disable. All icons respect <code className="typo-code bg-muted px-xs rounded-sm">prefers-reduced-motion</code>.
          </p>
        </div>

        <div className="gap-sm flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Icon set — hover to animate</h2>
          </div>
          <div className="gap-sm grid grid-cols-4">
            {icons.map((icon) => (
              <div
                key={icon.name}
                className="border-border bg-card gap-sm p-md hover:bg-muted/40 flex flex-col items-center rounded-lg border transition-colors"
              >
                <div className="text-foreground">{icon.component}</div>
                <div className="flex flex-col items-center gap-0.5 text-center">
                  <span className="typo-caption text-foreground font-medium">{icon.name}</span>
                  <code className="typo-code text-muted-foreground">{icon.path.split("/").pop()}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gap-md flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Usage</h2>
          </div>
          <div className="border-border bg-muted p-md typo-code text-foreground overflow-x-auto rounded-lg border font-mono">
            <pre>{`// Import directly — no barrel imports
import { SearchIcon } from "@workspace/ui/components/icons/search/search.icon";
import { ArrowLeftIcon } from "@workspace/ui/components/icons/arrow-left/arrow-left.icon";
import { HouseIcon } from "@workspace/ui/components/icons/home/home.icon";

// Animated on hover (default)
<SearchIcon size={20} />

// Static, no animation
<SearchIcon size={20} isAnimated={false} />

// Custom color via className or style
<SearchIcon size={20} className="text-primary" />
<SearchIcon size={20} color="var(--accent)" />`}</pre>
          </div>
        </div>

        <div className="gap-md flex flex-col">
          <div className="border-border pb-sm border-b">
            <h2 className="typo-h3 text-foreground">Props</h2>
          </div>
          <div className="border-border overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-border border-b">
                  <th className="typo-caption text-muted-foreground p-sm text-left font-medium">Prop</th>
                  <th className="typo-caption text-muted-foreground p-sm text-left font-medium">Type</th>
                  <th className="typo-caption text-muted-foreground p-sm text-left font-medium">Default</th>
                  <th className="typo-caption text-muted-foreground p-sm text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { prop: "size", type: "number", def: "24", desc: "Width and height in px" },
                  { prop: "isAnimated", type: "boolean", def: "true", desc: "Enable hover animation" },
                  { prop: "duration", type: "number", def: "1", desc: "Animation speed multiplier" },
                  { prop: "color", type: "string", def: "currentColor", desc: "Icon stroke color" },
                  { prop: "className", type: "string", def: "—", desc: "Applied to the wrapper div" }
                ].map((row, i) => (
                  <tr key={row.prop} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                    <td className="p-sm"><code className="typo-code text-primary">{row.prop}</code></td>
                    <td className="p-sm"><code className="typo-code text-muted-foreground">{row.type}</code></td>
                    <td className="p-sm"><code className="typo-code text-foreground">{row.def}</code></td>
                    <td className="typo-body-sm text-muted-foreground p-sm">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
};
