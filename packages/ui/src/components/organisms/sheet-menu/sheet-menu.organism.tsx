import React, { useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import type { RestaurantMenuItem } from "@workspace/client";

import { PencilIcon } from "@/components/icons/pencil/pencil.icon";
import { PlusIcon } from "@/components/icons/plus/plus.icon";
import { KpiCard } from "@/components/molecules/kpi-card/kpi-card.molecule";
import { SearchInput } from "@/components/molecules/search-input/search-input.molecule";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";


const AVAILABILITY_PERCENT_MULTIPLIER = 100;
const PAGE_SIZE = 12;
const FIRST_PAGE = 1;
const ICON_SIZE = 16;
const EDIT_ICON_SIZE = 14;

const CATEGORY_GRADIENTS = [
  "linear-gradient(135deg, var(--color-primary), var(--color-ring))",
  "linear-gradient(135deg, var(--color-secondary), var(--color-primary))",
  "linear-gradient(135deg, var(--color-ring), var(--color-secondary))",
  "linear-gradient(135deg, var(--color-muted), var(--color-ring))",
  "linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
] as const;

const CATEGORIES = [
  "all",
  "menu",
  "starter",
  "main",
  "dessert",
  "drink",
  "side",
  "other"
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

const CATEGORY_LABEL_KEYS: Record<CategoryFilter, string> = {
  all: "restaurants.menu.filterAll",
  menu: "restaurants.menu.filterMenu",
  starter: "restaurants.menu.filterStarter",
  main: "restaurants.menu.filterMain",
  dessert: "restaurants.menu.filterDessert",
  drink: "restaurants.menu.filterDrink",
  side: "restaurants.menu.filterSide",
  other: "restaurants.menu.filterOther"
};

const getCategoryGradient = (category: string): string => {
  const index = CATEGORIES.indexOf(category as CategoryFilter);
  const safeIndex = index < 0 ? 0 : index;

  return CATEGORY_GRADIENTS[safeIndex % CATEGORY_GRADIENTS.length];
};

interface SheetMenuProps {
  items: ReadonlyArray<RestaurantMenuItem>;
  renderCreateDialog?: (props: { open: boolean; onOpenChange: (open: boolean) => void }) => React.ReactNode;
  renderCreateMenuDialog?: (props: { open: boolean; onOpenChange: (open: boolean) => void }) => React.ReactNode;
  renderEditDialog?: (props: {
    item: RestaurantMenuItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) => React.ReactNode;
  addMenuLabel?: string;
}

function buildAvailabilityMap(items: ReadonlyArray<RestaurantMenuItem>): Record<string, boolean> {
  return Object.fromEntries(items.map((item) => [item.id, item.available]));
}

const SheetMenu = ({
  items,
  renderCreateDialog,
  renderCreateMenuDialog,
  renderEditDialog,
  addMenuLabel
}: SheetMenuProps): React.JSX.Element => {
  const { t } = useTranslation("common");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RestaurantMenuItem | null>(null);
  const [availability, setAvailability] = useState(() => buildAvailabilityMap(items));

  const toggleAvailability = (id: string): void => {
    setAvailability((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const availableCount = useMemo(
    () => Object.values(availability).filter(Boolean).length,
    [availability]
  );

  const filteredItems = useMemo(() => {
    let result: ReadonlyArray<RestaurantMenuItem>;

    if (activeCategory === "all") {
      result = items;
    } else if (activeCategory === "menu") {
      result = items.filter((item) => item.kind === "menu" || item.category === "menu");
    } else {
      result = items.filter((item) => item.category === activeCategory);
    }

    const q = search.trim().toLowerCase();

    if (q) {
      result = result.filter((item) => item.name.toLowerCase().includes(q));
    }

    return result;
  }, [items, activeCategory, search]);

  const [page, setPage] = useState(FIRST_PAGE);

  useEffect(() => {
    setPage(FIRST_PAGE);
  }, [activeCategory, search]);

  const totalPages = Math.max(FIRST_PAGE, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - FIRST_PAGE) * PAGE_SIZE;
  const pagedItems = filteredItems.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <>
      <div className="gap-sm grid grid-cols-2">
        <KpiCard
          variant="subtle"
          label={t("restaurants.menu.totalItems")}
          value={items.length}
        />
        <KpiCard
          variant="subtle"
          label={t("restaurants.menu.availableItems")}
          value={availableCount}
          trend={`${items.length === 0 ? 0 : Math.round((availableCount / items.length) * AVAILABILITY_PERCENT_MULTIPLIER)}%`}
          trendDirection="up"
        />
      </div>

      <div className="gap-sm flex items-center">
        <SearchInput
          className="flex-1"
          placeholder={t("restaurants.menu.search")}
          value={search}
          onChange={setSearch}
        />
        {renderCreateMenuDialog ? (
          <Button size="sm" variant="outline" onClick={() => setMenuDialogOpen(true)}>
            <PlusIcon size={ICON_SIZE} data-icon="inline-start" />
            {addMenuLabel ?? t("restaurants.menu.addMenu")}
          </Button>
        ) : null}
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <PlusIcon size={ICON_SIZE} data-icon="inline-start" />
          {t("restaurants.menu.addDish")}
        </Button>
      </div>

      {renderCreateDialog?.({ open: dialogOpen, onOpenChange: setDialogOpen })}
      {renderCreateMenuDialog?.({ open: menuDialogOpen, onOpenChange: setMenuDialogOpen })}
      {editingItem
        ? renderEditDialog?.({
          item: editingItem,
          open: true,
          onOpenChange: (next) => {
            if (!next) setEditingItem(null);
          }
        })
        : null}

      <div className="gap-xs flex flex-wrap">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          const label = t(CATEGORY_LABEL_KEYS[category]);

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors",
                isActive
                  ? "border-primary/50 bg-primary/20 text-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filteredItems.length === 0 ? (
        <p className="glass p-xl text-muted-foreground typo-caption rounded-md border-dashed text-center">
          {t("restaurants.menu.emptyCategory")}
        </p>
      ) : (
        <TooltipProvider>
          <div className="gap-sm @container flex flex-col">
            <div className="gap-sm grid grid-cols-2 @md:grid-cols-3 @4xl:grid-cols-6">
              {pagedItems.map((item) => {
                const isAvailable = availability[item.id] ?? item.available;
                const categoryKey = CATEGORY_LABEL_KEYS[item.category as CategoryFilter];
                const categoryLabel = categoryKey ? t(categoryKey) : item.category;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "glass group hover:border-primary/30 relative flex flex-col overflow-hidden rounded-xl transition-all hover:-translate-y-0.5",
                      !isAvailable && "opacity-60 hover:opacity-90"
                    )}
                  >
                    <div
                      className="relative aspect-square w-full overflow-hidden"
                      style={{ background: getCategoryGradient(item.category) }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="duration-base absolute inset-0 size-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="from-background/70 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
                      <div className="p-xs absolute inset-x-0 top-0 flex justify-between">
                        <span className="bg-background/40 typo-overline px-xs py-3xs text-foreground/90 truncate rounded-full backdrop-blur-sm">
                          {categoryLabel}
                        </span>
                      </div>
                      <div className="top-xs right-xs pointer-events-none absolute opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100">
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon-sm"
                                aria-label={t("restaurants.menu.edit")}
                                onClick={() => {
                                  if (renderEditDialog) setEditingItem(item);
                                }}
                                disabled={!renderEditDialog}
                                className="bg-background/85 hover:bg-background backdrop-blur-md"
                              >
                                <PencilIcon size={EDIT_ICON_SIZE} />
                              </Button>
                            }
                          />
                          <TooltipContent>
                            {t("restaurants.menu.edit")}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    <div className="p-sm gap-2xs flex flex-1 flex-col">
                      <p className="text-foreground typo-body truncate">
                        {item.name}
                      </p>
                      <div className="gap-xs mt-auto flex items-center justify-between">
                        <span className="text-foreground typo-h5 tabular-nums">
                        €{item.price.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleAvailability(item.id)}
                          aria-pressed={isAvailable}
                          className={cn(
                            "gap-3xs typo-caption px-xs py-3xs focus-visible:ring-ring/50 inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none",
                            isAvailable
                              ? "bg-status-good/15 text-status-good hover:bg-status-good/25"
                              : "bg-status-bad/15 text-status-bad hover:bg-status-bad/25"
                          )}
                        >
                          <span
                            className={cn(
                              "size-2xs rounded-full",
                              isAvailable ? "bg-status-good" : "bg-status-bad"
                            )}
                          />
                          <span className="truncate">
                            {isAvailable
                              ? t("restaurants.menu.available")
                              : t("restaurants.menu.unavailable")}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > FIRST_PAGE ? (
              <Pagination className="pt-2xs">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-label={t("restaurants.menu.prevPage")}
                      disabled={safePage === FIRST_PAGE}
                      onClick={() => setPage((p) => Math.max(FIRST_PAGE, p - 1))}
                    >
                      {t("restaurants.menu.prevPage")}
                    </PaginationPrevious>
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + FIRST_PAGE).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={p === safePage}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      aria-label={t("restaurants.menu.nextPage")}
                      disabled={safePage === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      {t("restaurants.menu.nextPage")}
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </div>
        </TooltipProvider>
      )}
    </>
  );
};

export { SheetMenu };

export type { SheetMenuProps };
