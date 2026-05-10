import React, { useMemo, useState } from "react";

import { AnimatePresence, motion } from "motion/react";


import type { NavIconComponent } from "@/components/molecules/sidebar-nav/sidebar-nav.molecule";

import { BrandMark } from "@/components/atoms/brand-mark/brand-mark.atom";
import { StatusDot } from "@/components/atoms/status-dot/status-dot.atom";
import { H4, Overline } from "@/components/atoms/typography/typography.atom";
import { ArrowRightIcon } from "@/components/icons/arrow-right/arrow-right.icon";
import { PlusIcon } from "@/components/icons/plus/plus.icon";
import { RestaurantListItem } from "@/components/molecules/restaurant-list-item/restaurant-list-item.molecule";
import { SearchInput } from "@/components/molecules/search-input/search-input.molecule";
import { SidebarNav } from "@/components/molecules/sidebar-nav/sidebar-nav.molecule";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBreakpoint } from "@/hooks/use-breakpoint/use-breakpoint.hook";
import { cn } from "@/lib/utils";


const COMPARE_ICON_SIZE = 16;
const SHELL_OPEN_DURATION = 0.42;
const SHELL_CLOSE_DURATION = 0.55;
const SHELL_EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
const CONTENT_DURATION = 0.32;
const CONTENT_OFFSET = 6;

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
  miniSecondarySlot?: React.ReactNode;
  miniName: string;
  miniStatus: "good" | "warn" | "bad" | "disabled";
  miniCaption: string;
  navItems: ReadonlyArray<SidebarNavItem>;
  activeTabId: string;
  secondaryTabId?: string | null;
  onTabChange: (id: string) => void;
  groupLabel: string;
  groupOverview: string;
  isGroupActive: boolean;
  onSelectGroup?: () => void;
  restaurants: ReadonlyArray<SidebarRestaurant>;
  activeRestaurantId: string | null;
  secondaryActiveRestaurantId?: string | null;
  onSelectRestaurant: (id: string) => void;
  searchPlaceholder: string;
  countLabel: string;
  viewAllLabel: string;
  onViewAll?: () => void;
  addRestaurantLabel?: string;
  onAddRestaurant?: () => void;
  compareMode?: boolean;
  compareLabel?: string;
  onToggleCompare?: () => void;
  onRequestClose?: () => void;
  className?: string;
}

const RestaurantSidebar = ({
  open,
  miniSlot,
  miniSecondarySlot,
  miniName,
  miniStatus,
  miniCaption,
  navItems,
  activeTabId,
  secondaryTabId,
  onTabChange,
  groupLabel,
  groupOverview,
  isGroupActive,
  onSelectGroup,
  restaurants,
  activeRestaurantId,
  secondaryActiveRestaurantId,
  onSelectRestaurant,
  searchPlaceholder,
  countLabel,
  viewAllLabel,
  onViewAll,
  addRestaurantLabel,
  onAddRestaurant,
  compareMode,
  compareLabel,
  onToggleCompare,
  onRequestClose,
  className
}: RestaurantSidebarProps): React.JSX.Element => {
  const [query, setQuery] = useState("");
  const { isMobileOrTablet } = useBreakpoint();

  const filtered = useMemo(() => {
    if (!query.trim()) return restaurants;
    const q = query.toLowerCase();

    return restaurants.filter((r) => r.name.toLowerCase().includes(q) || r.caption.toLowerCase().includes(q));
  }, [restaurants, query]);

  const selectionKey = isGroupActive
    ? "__group"
    : activeRestaurantId ?? "__none";

  return (
    <>
      {isMobileOrTablet && open && onRequestClose ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onRequestClose}
          aria-hidden="true"
          className="fixed inset-0 z-[54] bg-black/40 backdrop-blur-sm"
        />
      ) : null}
    <motion.aside
      initial={false}
      animate={open ? "open" : "closed"}
      variants={{
        open: { x: 0, opacity: 1 },
        closed: { x: "calc(-100% - 2rem)", opacity: 0 }
      }}
      transition={{
        duration: open ? SHELL_OPEN_DURATION : SHELL_CLOSE_DURATION,
        ease: SHELL_EASE
      }}
      style={{ pointerEvents: open ? "auto" : "none" }}
      className={cn(
        "glass-strong fixed md:absolute",
        "top-sm bottom-sm left-sm rounded-xl",
        isMobileOrTablet ? "z-[55] w-[min(20rem,calc(100vw-5rem))]" : "z-30 w-60",
        className
      )}
    >
      <div className="p-xs flex h-full min-h-0 flex-col gap-0 overflow-hidden">
        <div className="shrink-0">
          <div className="px-2xs pb-2xs flex items-center justify-between">
            <BrandMark size="sm" className="h-md" />
            {onToggleCompare && (
              <Button
                variant={compareMode ? "tertiary" : "ghost"}
                size="icon-sm"
                className="rounded-md"
                onClick={onToggleCompare}
                aria-label={compareLabel}
                aria-pressed={compareMode}
              >
                <PlusIcon size={COMPARE_ICON_SIZE} />
              </Button>
            )}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`mini-${selectionKey}-${miniSecondarySlot ? "split" : "single"}`}
              initial={{ opacity: 0, y: CONTENT_OFFSET }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -CONTENT_OFFSET }}
              transition={{ duration: CONTENT_DURATION, ease: SHELL_EASE }}
            >
              {miniSecondarySlot ? (
                <div className="gap-2xs flex aspect-[4/3]">
                  <div className="glass relative isolate flex-1 overflow-hidden rounded-lg">
                    {miniSlot}
                  </div>
                  <div className="glass relative isolate flex-1 overflow-hidden rounded-lg">
                    {miniSecondarySlot}
                  </div>
                </div>
              ) : (
                <div className="glass relative isolate aspect-[4/3] overflow-hidden rounded-lg">
                  {miniSlot}
                </div>
              )}
              <div className="px-sm">
                <H4 className="text-foreground mt-md scroll-m-0 truncate">{miniName}</H4>
                <div className="mt-xs gap-xs flex items-center">
                  <StatusDot status={miniStatus} size="sm" />
                  <Overline className="text-muted-foreground">{miniCaption}</Overline>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <SidebarNav
            items={navItems}
            activeId={activeTabId}
            secondaryActiveId={secondaryTabId}
            onSelect={onTabChange}
            className="mt-md gap-3xs flex flex-col"
          />
        </div>

        <Separator className="my-md opacity-40" />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="pl-sm pb-sm flex shrink-0 items-center justify-between">
            <Overline className="text-foreground/70">{countLabel}</Overline>
            <div className="gap-3xs flex items-center">
              {onAddRestaurant && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-md"
                  onClick={onAddRestaurant}
                  aria-label={addRestaurantLabel}
                >
                  <PlusIcon size={COMPARE_ICON_SIZE} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-md"
                onClick={onViewAll}
                aria-label={viewAllLabel}
              >
                <ArrowRightIcon size={COMPARE_ICON_SIZE} />
              </Button>
            </div>
          </div>

          <div className="pb-xs shrink-0">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={searchPlaceholder}
            />
          </div>

          <div className="gap-3xs flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <RestaurantListItem
              name={groupLabel}
              caption={groupOverview}
              status="disabled"
              tone="group"
              active={isGroupActive}
              onClick={onSelectGroup ?? undefined}
            />
            {filtered.map((r) => {
              const isPrimary = r.id === activeRestaurantId;
              const isSecondary =
                secondaryActiveRestaurantId !== undefined &&
                secondaryActiveRestaurantId !== null &&
                r.id === secondaryActiveRestaurantId;
              const showCompareBadges = secondaryActiveRestaurantId != null;
              const badge = showCompareBadges
                ? isPrimary
                  ? "1"
                  : isSecondary
                    ? "2"
                    : undefined
                : undefined;

              return (
                <RestaurantListItem
                  key={r.id}
                  name={r.name}
                  caption={r.caption}
                  status={r.status}
                  active={isPrimary || isSecondary}
                  badge={badge}
                  onClick={() => onSelectRestaurant(r.id)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </motion.aside>
    </>
  );
};

export { RestaurantSidebar };

export type { RestaurantSidebarProps, SidebarRestaurant, SidebarNavItem };
