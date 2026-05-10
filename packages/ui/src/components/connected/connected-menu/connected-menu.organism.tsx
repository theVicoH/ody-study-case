import React, { useMemo } from "react";

import { useDishes, useMenus } from "@workspace/client";

import type { ApiDish, ApiMenu, RestaurantMenuItem } from "@workspace/client";

import { ConnectedDishDialog } from "@/components/connected/connected-dish-dialog/connected-dish-dialog.organism";
import { ConnectedMenuDialog } from "@/components/connected/connected-menu-dialog/connected-menu-dialog.organism";
import { SheetMenu } from "@/components/organisms/sheet-menu/sheet-menu.organism";
import { Skeleton } from "@/components/ui/skeleton";

const CENTS_PER_EURO = 100;

interface ConnectedMenuProps {
  restaurantId: string;
}

const buildItems = (
  dishes: ReadonlyArray<ApiDish>,
  menus: ReadonlyArray<ApiMenu>
): RestaurantMenuItem[] => {
  const dishItems: RestaurantMenuItem[] = dishes.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.category,
    price: d.priceCents / CENTS_PER_EURO,
    available: d.isActive,
    image: d.imageUrl ?? "",
    kind: "dish" as const
  }));

  const menuItems: RestaurantMenuItem[] = menus.map((m) => ({
    id: m.id,
    name: m.name,
    category: "menu",
    price: m.priceCents / CENTS_PER_EURO,
    available: m.isActive,
    image: "",
    kind: "menu" as const
  }));

  return [...menuItems, ...dishItems];
};

const MenuSkeleton = (): React.JSX.Element => (
  <>
    <div className="gap-sm grid shrink-0 grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-lg" />
      ))}
    </div>
    <div className="gap-xs flex shrink-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-full" />
      ))}
    </div>
    <div className="gap-sm grid grid-cols-2 sm:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-lg" />
      ))}
    </div>
  </>
);

const ConnectedMenu = ({ restaurantId }: ConnectedMenuProps): React.JSX.Element => {
  const dishesQuery = useDishes(restaurantId);
  const menusQuery = useMenus(restaurantId);

  const dishes = useMemo(() => dishesQuery.data?.data ?? [], [dishesQuery.data]);
  const menus = useMemo(() => menusQuery.data?.data ?? [], [menusQuery.data]);
  const items = useMemo(() => buildItems(dishes, menus), [dishes, menus]);

  if (dishesQuery.isPending || menusQuery.isPending) return <MenuSkeleton />;

  return (
    <SheetMenu
      items={items}
      renderCreateDialog={({ open, onOpenChange }) => (
        <ConnectedDishDialog
          restaurantId={restaurantId}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
      renderCreateMenuDialog={({ open, onOpenChange }) => (
        <ConnectedMenuDialog
          restaurantId={restaurantId}
          open={open}
          onOpenChange={onOpenChange}
        />
      )}
      renderEditDialog={({ item, open, onOpenChange }) => {
        if (item.kind === "menu") {
          const menu = menus.find((m) => m.id === item.id) ?? null;

          return (
            <ConnectedMenuDialog
              restaurantId={restaurantId}
              open={open}
              onOpenChange={onOpenChange}
              menu={menu}
            />
          );
        }

        const dish = dishes.find((d) => d.id === item.id) ?? null;

        return (
          <ConnectedDishDialog
            restaurantId={restaurantId}
            open={open}
            onOpenChange={onOpenChange}
            dish={dish}
          />
        );
      }}
    />
  );
};

export { ConnectedMenu };
