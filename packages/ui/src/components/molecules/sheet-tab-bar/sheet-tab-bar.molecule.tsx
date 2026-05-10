import React from "react";

import { PanelRightIcon } from "@/components/icons/panel-right/panel-right.icon";
import type { NavIconComponent } from "@/components/molecules/sidebar-nav/sidebar-nav.molecule";

import { cn } from "@/lib/utils";


const ICON_SIZE = 14;
const SPLIT_ICON_SIZE = 12;

interface SheetTabItem {
  id: string;
  label: string;
  icon: NavIconComponent;
}

interface SheetTabBarProps {
  items: ReadonlyArray<SheetTabItem>;
  activeId: string;
  secondaryActiveId?: string | null;
  onTabChange: (id: string) => void;
  onSplit?: (id: string) => void;
  splitLabel?: string;
  className?: string;
}

const SplitRightGlyph = (): React.JSX.Element => (
  <PanelRightIcon size={SPLIT_ICON_SIZE} isAnimated={false} aria-hidden="true" />
);

const SheetTabBar = ({
  items,
  activeId,
  secondaryActiveId,
  onTabChange,
  onSplit,
  splitLabel,
  className
}: SheetTabBarProps): React.JSX.Element => (
  <div className={cn("gap-3xs flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}>
    {items.map(({ id, label, icon: Icon }) => {
      const isActive = id === activeId;
      const isSecondaryActive =
        secondaryActiveId !== undefined &&
        secondaryActiveId !== null &&
        id === secondaryActiveId;
      const showSplit = onSplit && !isActive;

      return (
        <div key={id} className="group/tab relative inline-flex shrink-0 items-stretch">
          <button
            type="button"
            onClick={() => onTabChange(id)}
            className={cn(
              "gap-2xs px-xs pt-xs pb-sm inline-flex shrink-0 items-center",
              "cursor-pointer border-b-2 text-[13px] font-medium transition-colors",
              isActive
                ? "border-primary text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground border-transparent"
            )}
          >
            <Icon size={ICON_SIZE} isAnimated={false} />
            {label}
            {isSecondaryActive && !isActive && (
              <span
                className="bg-primary/15 text-primary px-2xs typo-overline rounded-sm"
                aria-hidden="true"
              >
                2
              </span>
            )}
          </button>
          {showSplit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSplit(id);
              }}
              aria-label={splitLabel}
              className={cn(
                "absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-md transition-opacity",
                "bg-foreground/8 text-muted-foreground hover:bg-foreground/15 hover:text-foreground",
                "opacity-0 group-hover/tab:opacity-100 focus-visible:opacity-100",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
              )}
            >
              <SplitRightGlyph />
            </button>
          )}
        </div>
      );
    })}
  </div>
);

export { SheetTabBar };

export type { SheetTabBarProps, SheetTabItem };
