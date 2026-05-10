import React from "react";

import type { NavIconComponent } from "@/components/molecules/sidebar-nav/sidebar-nav.molecule";

import { cn } from "@/lib/utils";


const ICON_SIZE = 14;

interface SheetTabItem {
  id: string;
  label: string;
  icon: NavIconComponent;
}

interface SheetTabBarProps {
  items: ReadonlyArray<SheetTabItem>;
  activeId: string;
  onTabChange: (id: string) => void;
  className?: string;
}

const SheetTabBar = ({
  items,
  activeId,
  onTabChange,
  className
}: SheetTabBarProps): React.JSX.Element => (
  <div className={cn("gap-3xs flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}>
    {items.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        type="button"
        onClick={() => onTabChange(id)}
        className={cn(
          "gap-2xs px-xs pt-xs pb-sm inline-flex shrink-0 items-center",
          "cursor-pointer border-b-2 text-[13px] font-medium transition-colors",
          id === activeId
            ? "border-primary text-foreground font-semibold"
            : "text-muted-foreground hover:text-foreground border-transparent"
        )}
      >
        <Icon size={ICON_SIZE} isAnimated={false} />
        {label}
      </button>
    ))}
  </div>
);

export { SheetTabBar };

export type { SheetTabBarProps, SheetTabItem };
