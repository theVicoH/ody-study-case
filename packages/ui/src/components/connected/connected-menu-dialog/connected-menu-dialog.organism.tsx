import React, { useEffect, useMemo, useState } from "react";

import { useCreateMenu, useDishes, useUpdateMenu } from "@workspace/client";
import { useTranslation } from "react-i18next";

import type { ApiDish, ApiMenu } from "@workspace/client";

import { SearchInput } from "@/components/molecules/search-input/search-input.molecule";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const CENTS_PER_EURO = 100;
const ALL_CATEGORIES = "__all__";
const TOTAL_STEPS = 3;

type Step = 1 | 2 | 3;

interface ConnectedMenuDialogProps {
  restaurantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu?: ApiMenu | null;
}

const formatEuro = (cents: number): string => `€${(cents / CENTS_PER_EURO).toFixed(2)}`;

const StepIndicator = ({ current, total }: { current: Step; total: number }): React.JSX.Element => (
  <div className="flex items-center justify-center gap-xs">
    {Array.from({ length: total }, (_, i) => {
      const stepNum = (i + 1) as Step;
      const isDone = stepNum < current;
      const isActive = stepNum === current;

      return (
        <React.Fragment key={stepNum}>
          {i > 0 && (
            <div
              className={cn(
                "h-[1px] w-xl transition-colors",
                isDone ? "bg-primary" : "bg-border"
              )}
            />
          )}
          <div
            className={cn(
              "typo-caption flex size-xl items-center justify-center rounded-full border transition-colors",
              isActive && "border-primary bg-primary text-primary-foreground",
              isDone && "border-primary bg-primary/20 text-primary",
              !isActive && !isDone && "border-border text-muted-foreground"
            )}
          >
            {stepNum}
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

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

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priceEuros, setPriceEuros] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [selectedDishIds, setSelectedDishIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [showSelectedOnly, setShowSelectedOnly] = useState<boolean>(false);

  useEffect(() => {
    if (!open) return;
    setStep(1);
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
    setSearch("");
    setCategory(ALL_CATEGORIES);
    setShowSelectedOnly(false);
    createMenu.reset();
    updateMenu.reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, menu?.id]);

  const dishes: ReadonlyArray<ApiDish> = useMemo(
    () => dishesQuery.data?.data ?? [],
    [dishesQuery.data]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();

    for (const d of dishes) set.add(d.category);

    return Array.from(set).sort();
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    const q = search.trim().toLowerCase();

    return dishes.filter((d) => {
      if (showSelectedOnly && !selectedDishIds.has(d.id)) return false;
      if (category !== ALL_CATEGORIES && d.category !== category) return false;
      if (q && !d.name.toLowerCase().includes(q) && !d.category.toLowerCase().includes(q)) {
        return false;
      }

      return true;
    });
  }, [dishes, search, category, showSelectedOnly, selectedDishIds]);

  const toggleDish = (id: string): void => {
    setSelectedDishIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  };

  const allFilteredSelected = filteredDishes.length > 0
    && filteredDishes.every((d) => selectedDishIds.has(d.id));

  const toggleSelectAllFiltered = (): void => {
    setSelectedDishIds((prev) => {
      const next = new Set(prev);

      if (allFilteredSelected) {
        for (const d of filteredDishes) next.delete(d.id);
      } else {
        for (const d of filteredDishes) next.add(d.id);
      }

      return next;
    });
  };

  const clearSelection = (): void => setSelectedDishIds(new Set());

  const priceNumber = Number(priceEuros);
  const step1Valid = name.trim().length >= 2
    && Number.isFinite(priceNumber)
    && priceNumber >= 0
    && priceEuros !== "";
  const step2Valid = selectedDishIds.size > 0;

  const goNext = (): void => setStep((s) => (s < TOTAL_STEPS ? (s + 1) as Step : s));
  const goBack = (): void => setStep((s) => (s > 1 ? (s - 1) as Step : s));

  const handleSubmit = (): void => {
    if (!step1Valid || !step2Valid) return;

    const payload = {
      name: name.trim(),
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
  const selectedDishes = useMemo(
    () => dishes.filter((d) => selectedDishIds.has(d.id)),
    [dishes, selectedDishIds]
  );

  const stepTitles: Record<Step, string> = {
    1: t("restaurants.menu.menuStep1Title"),
    2: t("restaurants.menu.menuStep2Title"),
    3: t("restaurants.menu.menuStep3Title")
  };

  const stepDescriptions: Record<Step, string> = {
    1: t("restaurants.menu.menuStep1Description"),
    2: t("restaurants.menu.menuStep2Description"),
    3: t("restaurants.menu.menuStep3Description")
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-md flex max-h-[85vh] w-[min(42rem,calc(100vw-2rem))] flex-col">
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

        <StepIndicator current={step} total={TOTAL_STEPS} />

        <div className="gap-2xs flex flex-col">
          <p className="text-foreground typo-h5">{stepTitles[step]}</p>
          <p className="text-muted-foreground typo-caption">{stepDescriptions[step]}</p>
        </div>

        <div className="gap-sm flex min-h-0 flex-1 flex-col">
          {step === 1 && (
            <>
              <div className="gap-sm grid grid-cols-1 sm:grid-cols-2">
                <div className="gap-xs flex flex-col">
                  <Label htmlFor="connected-menu-name">{t("restaurants.menu.menuName")}</Label>
                  <Input
                    id="connected-menu-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    minLength={2}
                    maxLength={120}
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
                  />
                </div>
              </div>

              <div className="gap-xs flex flex-col">
                <Label htmlFor="connected-menu-description">
                  {t("restaurants.menu.menuDescription")}
                </Label>
                <Input
                  id="connected-menu-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </>
          )}

          {step === 2 && (
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
                  <div className="gap-xs flex flex-col sm:flex-row">
                    <SearchInput
                      className="flex-1"
                      value={search}
                      onChange={setSearch}
                      placeholder={t("restaurants.menu.menuDishesSearch")}
                    />
                    <Select
                      value={category}
                      onValueChange={(v) => { if (v !== null) setCategory(v); }}
                    >
                      <SelectTrigger className="sm:w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL_CATEGORIES}>
                          {t("restaurants.menu.menuCategoryAll")}
                        </SelectItem>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="gap-xs flex flex-wrap items-center justify-between">
                    <div className="gap-xs flex items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={toggleSelectAllFiltered}
                        disabled={filteredDishes.length === 0}
                      >
                        {allFilteredSelected
                          ? t("restaurants.menu.menuDishesUnselectAll")
                          : t("restaurants.menu.menuDishesSelectAll")}
                      </Button>
                      {selectedCount > 0 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearSelection}
                        >
                          {t("restaurants.menu.menuDishesClear")}
                        </Button>
                      ) : null}
                    </div>
                    <label className="gap-xs typo-caption text-muted-foreground flex cursor-pointer items-center">
                      <Checkbox
                        checked={showSelectedOnly}
                        onCheckedChange={(v) => setShowSelectedOnly(v === true)}
                      />
                      {t("restaurants.menu.menuDishesShowSelected")}
                    </label>
                  </div>

                  <div className="border-border min-h-0 flex-1 overflow-y-auto rounded-md border">
                    {filteredDishes.length === 0 ? (
                      <p className="text-muted-foreground typo-caption p-3 text-center">
                        {t("restaurants.menu.menuDishesNoMatch")}
                      </p>
                    ) : (
                      <ul className="divide-border divide-y">
                        {filteredDishes.map((d) => {
                          const checked = selectedDishIds.has(d.id);

                          return (
                            <li key={d.id}>
                              <label
                                className={cn(
                                  "px-sm py-xs gap-sm hover:bg-muted/40 flex cursor-pointer items-center",
                                  checked && "bg-primary/5"
                                )}
                              >
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={() => toggleDish(d.id)}
                                />
                                {d.imageUrl ? (
                                  <img
                                    src={d.imageUrl}
                                    alt=""
                                    className="border-border size-8 shrink-0 rounded-sm border object-cover"
                                  />
                                ) : (
                                  <div className="bg-muted size-8 shrink-0 rounded-sm" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-foreground typo-body truncate">{d.name}</p>
                                  <p className="text-muted-foreground typo-caption truncate">
                                    {d.category}
                                  </p>
                                </div>
                                <span className="typo-body shrink-0 tabular-nums">
                                  {formatEuro(d.priceCents)}
                                </span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {selectedCount === 0 ? (
                    <p className="text-destructive typo-caption">
                      {t("restaurants.menu.menuDishesEmpty")}
                    </p>
                  ) : null}
                </>
              )}
            </div>
          )}

          {step === TOTAL_STEPS && (
            <div className="gap-sm flex flex-col">
              <div className="bg-muted/30 border-border gap-sm flex flex-col rounded-lg border p-md">
                <div className="gap-xs flex flex-col">
                  <span className="text-muted-foreground typo-caption">
                    {t("restaurants.menu.menuName")}
                  </span>
                  <span className="text-foreground typo-body">{name.trim()}</span>
                </div>

                <div className="gap-xs flex flex-col">
                  <span className="text-muted-foreground typo-caption">
                    {t("restaurants.menu.menuReviewPrice")}
                  </span>
                  <span className="text-foreground typo-body">
                    {formatEuro(Math.round(priceNumber * CENTS_PER_EURO))}
                  </span>
                </div>

                {description.trim() ? (
                  <div className="gap-xs flex flex-col">
                    <span className="text-muted-foreground typo-caption">
                      {t("restaurants.menu.menuDescription")}
                    </span>
                    <span className="text-foreground typo-body">{description.trim()}</span>
                  </div>
                ) : null}
              </div>

              <div className="gap-xs flex flex-col">
                <span className="text-muted-foreground typo-caption">
                  {t("restaurants.menu.menuReviewDishes")} ({selectedCount})
                </span>
                <ul className="border-border divide-border max-h-4xl divide-y overflow-y-auto rounded-md border">
                  {selectedDishes.map((d) => (
                    <li
                      key={d.id}
                      className="px-sm py-xs gap-sm flex items-center"
                    >
                      {d.imageUrl ? (
                        <img
                          src={d.imageUrl}
                          alt=""
                          className="border-border size-lg shrink-0 rounded-sm border object-cover"
                        />
                      ) : (
                        <div className="bg-muted size-lg shrink-0 rounded-sm" />
                      )}
                      <span className="text-foreground typo-caption min-w-0 flex-1 truncate">
                        {d.name}
                      </span>
                      <span className="text-muted-foreground typo-caption shrink-0 tabular-nums">
                        {formatEuro(d.priceCents)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {isEdit ? (
                <label className="gap-xs typo-caption flex cursor-pointer items-center">
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={(v) => setIsActive(v === true)}
                  />
                  {t("restaurants.menu.menuReviewAvailability")} —{" "}
                  {isActive
                    ? t("restaurants.menu.available")
                    : t("restaurants.menu.unavailable")}
                </label>
              ) : null}

              {errorMessage ? (
                <p className="bg-destructive/10 text-destructive typo-caption rounded-md px-sm py-xs">
                  {errorMessage}
                </p>
              ) : null}
            </div>
          )}
        </div>

        <div className="gap-xs flex items-center justify-between">
          <div>
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={goBack} disabled={isPending}>
                {t("restaurants.menu.menuStepBack")}
              </Button>
            ) : (
              <DialogClose render={<Button type="button" variant="outline" />}>
                {t("restaurants.menu.cancel")}
              </DialogClose>
            )}
          </div>

          <div>
            {step < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={
                  (step === 1 && !step1Valid)
                  || (step === 2 && !step2Valid && !dishesEmpty)
                }
              >
                {t("restaurants.menu.menuStepNext")}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isPending || !step1Valid || !step2Valid}
              >
                {isEdit
                  ? t("restaurants.menu.submitUpdate")
                  : t("restaurants.menu.submitCreate")}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ConnectedMenuDialog };

export type { ConnectedMenuDialogProps };
