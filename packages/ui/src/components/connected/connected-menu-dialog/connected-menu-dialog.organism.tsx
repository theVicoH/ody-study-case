import React, { useEffect, useMemo, useState } from "react";

import { useCreateMenu, useDishes, useUpdateMenu } from "@workspace/client";
import { useTranslation } from "react-i18next";

import type { ApiDish, ApiMenu } from "@workspace/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const CENTS_PER_EURO = 100;

interface ConnectedMenuDialogProps {
  restaurantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu?: ApiMenu | null;
}

const formatEuro = (cents: number): string => `€${(cents / CENTS_PER_EURO).toFixed(2)}`;

const ConnectedMenuDialog = ({
  restaurantId,
  open,
  onOpenChange,
  menu
}: ConnectedMenuDialogProps): React.JSX.Element => {
  const { t } = useTranslation("common");
  const dishesQuery = useDishes(restaurantId);
  const createMenu = useCreateMenu(restaurantId);
  const updateMenu = useUpdateMenu(restaurantId);

  const isEdit = Boolean(menu?.id);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priceEuros, setPriceEuros] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [selectedDishIds, setSelectedDishIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    if (menu) {
      setName(menu.name);
      setDescription(menu.description ?? "");
      setPriceEuros(String(menu.priceCents / CENTS_PER_EURO));
      setIsActive(menu.isActive);
      setSelectedDishIds(new Set(menu.dishIds));
    } else {
      setName("");
      setDescription("");
      setPriceEuros("");
      setIsActive(true);
      setSelectedDishIds(new Set());
    }
    createMenu.reset();
    updateMenu.reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, menu?.id]);

  const dishes: ReadonlyArray<ApiDish> = useMemo(
    () => dishesQuery.data?.data ?? [],
    [dishesQuery.data]
  );

  const toggleDish = (id: string): void => {
    setSelectedDishIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmedName = name.trim();
    const priceNumber = Number(priceEuros);

    if (trimmedName.length < 2 || !Number.isFinite(priceNumber) || priceNumber < 0) return;
    if (selectedDishIds.size === 0) return;

    const payload = {
      name: trimmedName,
      description: description.trim() || null,
      priceCents: Math.round(priceNumber * CENTS_PER_EURO),
      isActive,
      dishIds: Array.from(selectedDishIds)
    };

    if (isEdit && menu) {
      updateMenu.mutate(
        { id: menu.id, input: payload },
        { onSuccess: () => onOpenChange(false) }
      );

      return;
    }

    createMenu.mutate(payload, { onSuccess: () => onOpenChange(false) });
  };

  const activeMutation = isEdit ? updateMenu : createMenu;
  const errorMessage = activeMutation.error instanceof Error ? activeMutation.error.message : null;
  const isPending = activeMutation.isPending;

  const selectedCount = selectedDishIds.size;
  const dishesEmpty = dishes.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-md flex max-h-[85vh] flex-col">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("restaurants.menu.editMenuTitle") : t("restaurants.menu.createMenuTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("restaurants.menu.editMenuDescription")
              : t("restaurants.menu.createMenuDescription")}
          </DialogDescription>
        </DialogHeader>

        <form
          id="connected-menu-form"
          onSubmit={handleSubmit}
          className="gap-sm flex min-h-0 flex-1 flex-col"
        >
          <div className="gap-xs flex flex-col">
            <Label htmlFor="connected-menu-name">{t("restaurants.menu.menuName")}</Label>
            <Input
              id="connected-menu-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={120}
              required
            />
          </div>

          <div className="gap-xs flex flex-col">
            <Label htmlFor="connected-menu-description">{t("restaurants.menu.menuDescription")}</Label>
            <Input
              id="connected-menu-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="gap-xs flex flex-col">
            <Label htmlFor="connected-menu-price">{t("restaurants.menu.menuPrice")}</Label>
            <Input
              id="connected-menu-price"
              type="number"
              min={0}
              step="0.01"
              value={priceEuros}
              onChange={(event) => setPriceEuros(event.target.value)}
              required
            />
          </div>

          <div className="gap-xs flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between">
              <Label>{t("restaurants.menu.menuDishes")}</Label>
              <span className="text-muted-foreground typo-caption">
                {t("restaurants.menu.menuItemsCount", {
                  count: selectedCount,
                  defaultValue_plural: "{{count}} dishes"
                })}
              </span>
            </div>
            {dishesEmpty ? (
              <p className="bg-muted/30 text-muted-foreground typo-caption rounded-md p-3">
                {t("restaurants.menu.menuNoDishes")}
              </p>
            ) : (
              <>
                <p className="text-muted-foreground typo-caption">
                  {t("restaurants.menu.menuDishesHint")}
                </p>
                <div className="border-border max-h-72 overflow-y-auto rounded-md border">
                  <ul className="divide-border divide-y">
                    {dishes.map((d) => {
                      const checked = selectedDishIds.has(d.id);

                      return (
                        <li key={d.id}>
                          <label
                            className={cn(
                              "px-sm py-xs gap-sm hover:bg-muted/40 flex cursor-pointer items-center",
                              checked && "bg-primary/5"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleDish(d.id)}
                            />
                            {d.imageUrl ? (
                              <img
                                src={d.imageUrl}
                                alt=""
                                className="border-border size-8 shrink-0 rounded border object-cover"
                              />
                            ) : (
                              <div className="bg-muted size-8 shrink-0 rounded" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-foreground typo-body truncate">{d.name}</p>
                              <p className="text-muted-foreground typo-caption truncate">
                                {d.category}
                              </p>
                            </div>
                            <span className="typo-body tabular-nums shrink-0">
                              {formatEuro(d.priceCents)}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {selectedCount === 0 ? (
                  <p className="text-destructive typo-caption">
                    {t("restaurants.menu.menuDishesEmpty")}
                  </p>
                ) : null}
              </>
            )}
          </div>

          {isEdit ? (
            <label className="gap-xs typo-caption flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
              />
              {isActive ? t("restaurants.menu.available") : t("restaurants.menu.unavailable")}
            </label>
          ) : null}

          {errorMessage ? (
            <p className="bg-destructive/10 text-destructive typo-caption rounded-md px-3 py-2">
              {errorMessage}
            </p>
          ) : null}
        </form>

        <div className="gap-xs flex justify-end">
          <DialogClose render={<Button type="button" variant="outline" />}>
            {t("restaurants.menu.cancel")}
          </DialogClose>
          <Button
            type="submit"
            form="connected-menu-form"
            disabled={isPending || dishesEmpty || selectedCount === 0}
          >
            {isEdit ? t("restaurants.menu.submitUpdate") : t("restaurants.menu.submitCreate")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ConnectedMenuDialog };
export type { ConnectedMenuDialogProps };
