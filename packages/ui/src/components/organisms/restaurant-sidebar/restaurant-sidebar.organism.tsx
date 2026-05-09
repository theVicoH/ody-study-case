import React, { useMemo, useState } from "react";

import type { NavIconComponent } from "@/components/molecules/sidebar-nav/sidebar-nav.molecule";

import { StatusDot } from "@/components/atoms/status-dot/status-dot.atom";
import { H4, Overline } from "@/components/atoms/typography/typography.atom";
import { SearchIcon } from "@/components/icons/search/search.icon";
import { RestaurantListItem } from "@/components/molecules/restaurant-list-item/restaurant-list-item.molecule";
import { SidebarNav } from "@/components/molecules/sidebar-nav/sidebar-nav.molecule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";


const SEARCH_ICON_SIZE = 14;

interface SidebarRestaurant {
  id: string;
  name: string;
  caption: string;
  status: "good" | "warn" | "bad";
}

interface SidebarNavItem {
  id: string;
  label: string;
  icon: NavIconComponent;
}

interface RestaurantSidebarProps {
  open: boolean;
  miniSlot: React.ReactNode;
  miniName: string;
  miniStatus: "good" | "warn" | "bad";
  miniCaption: string;
  navItems: ReadonlyArray<SidebarNavItem>;
  activeTabId: string;
  onTabChange: (id: string) => void;
  groupLabel: string;
  groupOverview: string;
  isGroupActive: boolean;
  onSelectGroup: () => void;
  restaurants: ReadonlyArray<SidebarRestaurant>;
  activeRestaurantId: string | null;
  onSelectRestaurant: (id: string) => void;
  searchPlaceholder: string;
  countLabel: string;
  viewAllLabel: string;
  onViewAll?: () => void;
  className?: string;
}

const RestaurantSidebar = ({
  open,
  miniSlot,
  miniName,
  miniStatus,
  miniCaption,
  navItems,
  activeTabId,
  onTabChange,
  groupLabel,
  groupOverview,
  isGroupActive,
  onSelectGroup,
  restaurants,
  activeRestaurantId,
  onSelectRestaurant,
  searchPlaceholder,
  countLabel,
  viewAllLabel,
  onViewAll,
  className
}: RestaurantSidebarProps): React.JSX.Element => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return restaurants;
    const q = query.toLowerCase();

    return restaurants.filter((r) => r.name.toLowerCase().includes(q) || r.caption.toLowerCase().includes(q));
  }, [restaurants, query]);

  return (
    <aside
      data-state={open ? "open" : "closed"}
      className={cn(
        "glass-strong pointer-events-auto absolute z-30",
        "top-sm bottom-sm left-sm w-60 rounded-xl",
        "ease-emphasized transition-[transform,opacity] duration-[380ms]",
        "data-[state=closed]:pointer-events-none data-[state=closed]:-translate-x-[calc(100%+2rem)] data-[state=closed]:opacity-0",
        className
      )}
    >
      <div className="p-xs flex h-full min-h-0 flex-col gap-0 overflow-hidden">
        <div className="shrink-0">
          <div className="bg-foreground/[0.04] relative isolate aspect-[4/3] overflow-hidden rounded-lg border border-white/[0.06]">
            {miniSlot}
          </div>
          <div className="px-sm">
            <H4 className="text-foreground mt-md scroll-m-0 truncate">{miniName}</H4>
            <div className="mt-xs gap-xs flex items-center">
              <StatusDot status={miniStatus} size="sm" />
              <Overline className="text-muted-foreground">{miniCaption}</Overline>
            </div>
          </div>

          <SidebarNav
            items={navItems}
            activeId={activeTabId}
            onSelect={onTabChange}
            className="mt-md gap-3xs flex flex-col"
          />
        </div>

        <Separator className="my-md opacity-40" />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="px-sm pb-sm flex shrink-0 items-center justify-between">
            <Overline className="text-foreground/70">{countLabel}</Overline>
            <Button
              variant="ghost"
              size="xs"
              className="typo-caption text-primary px-xs h-auto py-0"
              onClick={onViewAll}
            >
              {viewAllLabel}
            </Button>
          </div>

          <div className="px-xs pb-xs shrink-0">
            <div className="relative">
              <span className="text-foreground/60 left-sm pointer-events-none absolute top-1/2 -translate-y-1/2">
                <SearchIcon size={SEARCH_ICON_SIZE} isAnimated={false} />
              </span>
              <Input
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className={cn("h-xl pl-xl typo-body-sm")}
              />
            </div>
          </div>

          <div className="px-xs min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <RestaurantListItem
              name={groupLabel}
              caption={groupOverview}
              tone="group"
              active={isGroupActive}
              onClick={onSelectGroup}
            />
            {filtered.map((r) => (
              <RestaurantListItem
                key={r.id}
                name={r.name}
                caption={r.caption}
                status={r.status}
                active={r.id === activeRestaurantId}
                onClick={() => onSelectRestaurant(r.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export { RestaurantSidebar };

export type { RestaurantSidebarProps, SidebarRestaurant, SidebarNavItem };
