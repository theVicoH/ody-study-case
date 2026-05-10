import React, { useEffect, useState } from "react";

import { useCreateDish, useUpdateDish } from "@workspace/client";
import { useTranslation } from "react-i18next";

import type { ApiDish } from "@workspace/client";

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
const KB = 1024;
const MAX_IMAGE_KB = 500;
const MAX_IMAGE_BYTES = MAX_IMAGE_KB * KB;

const CATEGORY_OPTIONS = ["starter", "main", "dessert", "drink", "side", "other"] as const;

type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

const DEFAULT_CATEGORY: CategoryOption = "main";

const isCategoryOption = (value: string): value is CategoryOption =>
  (CATEGORY_OPTIONS as ReadonlyArray<string>).includes(value);

interface ConnectedDishDialogProps {
  restaurantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dish?: ApiDish | null;
}

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("read-failed"));
    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") resolve(result);
      else reject(new Error("read-failed"));
    };
    reader.readAsDataURL(file);
  });

const ConnectedDishDialog = ({
  restaurantId,
  open,
  onOpenChange,
  dish
}: ConnectedDishDialogProps): React.JSX.Element => {
  const { t } = useTranslation("common");
  const createDish = useCreateDish(restaurantId);
  const updateDish = useUpdateDish(restaurantId);

  const isEdit = Boolean(dish?.id);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priceEuros, setPriceEuros] = useState<string>("");
  const [category, setCategory] = useState<CategoryOption>(DEFAULT_CATEGORY);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (dish) {
      setName(dish.name);
      setDescription(dish.description ?? "");
      setPriceEuros(String(dish.priceCents / CENTS_PER_EURO));
      setCategory(isCategoryOption(dish.category) ? dish.category : DEFAULT_CATEGORY);
      setImageUrl(dish.imageUrl ?? "");
      setIsActive(dish.isActive);
    } else {
      setName("");
      setDescription("");
      setPriceEuros("");
      setCategory(DEFAULT_CATEGORY);
      setImageUrl("");
      setIsActive(true);
    }
    setUploadError(null);
    createDish.reset();
    updateDish.reset();
  }, [open, dish?.id]);

  const handleOpenChange = (next: boolean): void => {
    onOpenChange(next);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];

    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadError(t("restaurants.menu.dishImageTooLarge", { max: MAX_IMAGE_KB }));

      return;
    }
    setUploadError(null);
    try {
      const dataUrl = await readFileAsDataUrl(file);

      setImageUrl(dataUrl);
    } catch {
      setUploadError(t("restaurants.menu.dishImageTooLarge", { max: MAX_IMAGE_KB }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmedName = name.trim();
    const priceNumber = Number(priceEuros);

    if (trimmedName.length < 2 || !Number.isFinite(priceNumber) || priceNumber < 0) return;

    const trimmedImage = imageUrl.trim();
    const payload = {
      name: trimmedName,
      description: description.trim() || null,
      priceCents: Math.round(priceNumber * CENTS_PER_EURO),
      category,
      imageUrl: trimmedImage || null,
      isActive
    };

    if (isEdit && dish) {
      updateDish.mutate(
        { id: dish.id, input: payload },
        { onSuccess: () => onOpenChange(false) }
      );

      return;
    }

    createDish.mutate(payload, { onSuccess: () => onOpenChange(false) });
  };

  const categoryLabels: Record<CategoryOption, string> = {
    starter: t("restaurants.menu.categoryStarter"),
    main: t("restaurants.menu.categoryMain"),
    dessert: t("restaurants.menu.categoryDessert"),
    drink: t("restaurants.menu.categoryDrink"),
    side: t("restaurants.menu.categorySide"),
    other: t("restaurants.menu.categoryOther")
  };

  const activeMutation = isEdit ? updateDish : createDish;
  const errorMessage = activeMutation.error instanceof Error ? activeMutation.error.message : null;
  const isPending = activeMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-md flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("restaurants.menu.editDishTitle") : t("restaurants.menu.createDishTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("restaurants.menu.editDishDescription")
              : t("restaurants.menu.createDishDescription")}
          </DialogDescription>
        </DialogHeader>

        <form id="connected-dish-form" onSubmit={handleSubmit} className="gap-sm flex flex-col">
          <div className="gap-xs flex flex-col">
            <Label htmlFor="connected-dish-name">{t("restaurants.menu.dishName")}</Label>
            <Input
              id="connected-dish-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={120}
              required
            />
          </div>

          <div className="gap-xs flex flex-col">
            <Label htmlFor="connected-dish-description">{t("restaurants.menu.dishDescription")}</Label>
            <Input
              id="connected-dish-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="gap-xs flex flex-col">
            <Label htmlFor="connected-dish-price">{t("restaurants.menu.dishPrice")}</Label>
            <Input
              id="connected-dish-price"
              type="number"
              min={0}
              step="0.01"
              value={priceEuros}
              onChange={(event) => setPriceEuros(event.target.value)}
              required
            />
          </div>

          <div className="gap-xs flex flex-col">
            <Label htmlFor="connected-dish-category">{t("restaurants.menu.dishCategory")}</Label>
            <Select
              value={category}
              onValueChange={(v) => { if (v !== null) setCategory(v as CategoryOption); }}
            >
              <SelectTrigger id="connected-dish-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {categoryLabels[opt]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="gap-xs flex flex-col">
            <Label>{t("restaurants.menu.dishImage")}</Label>
            <div className="gap-xs flex items-start">
              {imageUrl.trim() ? (
                <div className="relative shrink-0">
                  <img
                    src={imageUrl.trim()}
                    alt={t("restaurants.menu.dishImagePreview")}
                    className="border-border aspect-square w-24 rounded-md border object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "border-border bg-muted/30 text-muted-foreground typo-caption",
                    "flex aspect-square w-24 shrink-0 items-center justify-center rounded-md border border-dashed text-center"
                  )}
                >
                  {t("restaurants.menu.dishImagePreview")}
                </div>
              )}
              <div className="gap-xs flex min-w-0 flex-1 flex-col">
                <Input
                  id="connected-dish-image-url"
                  type="url"
                  placeholder="https://…"
                  value={imageUrl.startsWith("data:") ? "" : imageUrl}
                  onChange={(event) => {
                    setUploadError(null);
                    setImageUrl(event.target.value);
                  }}
                />
                <div className="gap-xs flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const el = document.getElementById("connected-dish-image-file");

                      if (el instanceof HTMLInputElement) el.click();
                    }}
                  >
                    {t("restaurants.menu.dishImageUpload")}
                  </Button>
                  {imageUrl.trim() ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setImageUrl("");
                        setUploadError(null);
                      }}
                    >
                      {t("restaurants.menu.dishImageRemove")}
                    </Button>
                  ) : null}
                </div>
                <input
                  id="connected-dish-image-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => { void handleFileChange(event); }}
                />
                {uploadError ? (
                  <p className="text-destructive typo-caption">{uploadError}</p>
                ) : null}
              </div>
            </div>
          </div>

          {isEdit ? (
            <label className="gap-xs typo-caption flex cursor-pointer items-center">
              <Checkbox
                checked={isActive}
                onCheckedChange={(v) => setIsActive(v === true)}
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
          <Button type="submit" form="connected-dish-form" disabled={isPending}>
            {isEdit ? t("restaurants.menu.submitUpdate") : t("restaurants.menu.submitCreate")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ConnectedDishDialog };

export type { ConnectedDishDialogProps };
