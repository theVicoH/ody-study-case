import React, { useMemo, useState } from "react";

import { useDishesMulti, useMenusMulti } from "@workspace/client";
import { SheetMenu } from "@workspace/ui/components/organisms/sheet-menu/sheet-menu.organism";
import { Skeleton } from "@workspace/ui/components/ui/skeleton";

import type { ApiDish, ApiMenu, RestaurantMenuItem } from "@workspace/client";
import type { RestaurantPickerDialogLabels, RestaurantPickerOption } from "@workspace/ui/components/organisms/restaurant-picker-dialog/restaurant-picker-dialog.organism";

import { ConnectedDishDialog } from "@/components/connected/connected-dish-dialog/connected-dish-dialog.organism";
import { ConnectedMenuDialog } from "@/components/connected/connected-menu-dialog/connected-menu-dialog.organism";
import { RestaurantPickerDialog } from "@/components/organisms/restaurant-picker-dialog/restaurant-picker-dialog.organism";

const CENTS_PER_EURO = 100;

interface ConnectedGroupMenuProps {
  restaurantIds: ReadonlyArray<string>;
  restaurants: ReadonlyArray<RestaurantPickerOption>;
  pickerLabels: RestaurantPickerDialogLabels;
}

const buildItems = (
  dishesByRestaurant: Map<string, ApiDish[]>,
  menusByRestaurant: Map<string, ApiMenu[]>
): RestaurantMenuItem[] => {
  const items: RestaurantMenuItem[] = [];

  for (const [restaurantId, dishes] of dishesByRestaurant) {
    for (const d of dishes) {
      items.push({
        id: `${restaurantId}_${d.id}`,
        name: d.name,
        category: d.category,
        price: d.priceCents / CENTS_PER_EURO,
        available: d.isActive,
        image: d.imageUrl ?? ""
      });
    }
  }

  for (const [restaurantId, menus] of menusByRestaurant) {
    for (const m of menus) {
      items.push({
        id: `${restaurantId}_${m.id}`,
        name: m.name,
        category: "menu",
        price: m.priceCents / CENTS_PER_EURO,
        available: m.isActive,
        image: ""
      });
    }
  }

  return items;
};

type PickerKind = "dish" | "menu";

const ConnectedGroupMenu = ({
  restaurantIds,
  restaurants,
  pickerLabels
}: ConnectedGroupMenuProps): React.JSX.Element => {
  const dishes = useDishesMulti(restaurantIds);
  const menus = useMenusMulti(restaurantIds);
  const [picked, setPicked] = useState<{ kind: PickerKind; restaurantId: string } | null>(null);

  const items = useMemo(
    () => buildItems(dishes.byRestaurant, menus.byRestaurant),
    [dishes.byRestaurant, menus.byRestaurant]
  );

  if (dishes.isLoading || menus.isLoading) {
    return (
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
  }

  const renderForKind = (
    kind: PickerKind,
    open: boolean,
    onOpenChange: (next: boolean) => void
  ): React.ReactNode => {
    const handleClose = (next: boolean): void => {
      onOpenChange(next);
      if (!next) setPicked(null);
    };

    if (picked && picked.kind === kind) {
      if (kind === "dish") {
        return (
          <ConnectedDishDialog
            restaurantId={picked.restaurantId}
            open={open}
            onOpenChange={handleClose}
          />
        );
      }

      return (
        <ConnectedMenuDialog
          restaurantId={picked.restaurantId}
          open={open}
          onOpenChange={handleClose}
        />
      );
    }

    return (
      <RestaurantPickerDialog
        open={open}
        onOpenChange={onOpenChange}
        labels={pickerLabels}
        restaurants={restaurants}
        onSelect={(id) => setPicked({ kind, restaurantId: id })}
      />
    );
  };

  return (
    <SheetMenu
      items={items}
      renderCreateDialog={({ open, onOpenChange }) => renderForKind("dish", open, onOpenChange)}
      renderCreateMenuDialog={({ open, onOpenChange }) => renderForKind("menu", open, onOpenChange)}
    />
  );
};

export { ConnectedGroupMenu };
