import React, { useState } from "react";

import type { RestaurantModelDef } from "@workspace/client";

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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const DAYS_IN_WEEK = 7;
const DEFAULT_OPEN = "12:00";
const DEFAULT_CLOSE = "22:30";

interface CreateRestaurantDialogLabels {
  title: string;
  description: string;
  nameLabel: string;
  namePlaceholder: string;
  addressLabel: string;
  addressPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  maxCoversLabel: string;
  modelLabel: string;
  openingHoursLabel?: string;
  dayLabels?: ReadonlyArray<string>;
  cancel: string;
  submit: string;
}

interface OpeningHourDraft {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface CreateRestaurantValues {
  name: string;
  address: string;
  phone: string;
  maxCovers: number;
  modelId: string;
  openingHours: OpeningHourDraft[];
}

const buildDefaultDraft = (): OpeningHourDraft[] =>
  Array.from({ length: DAYS_IN_WEEK }, (_, i) => {
    const dayOfWeek = (i + 1) % DAYS_IN_WEEK;

    return {
      dayOfWeek,
      isOpen: dayOfWeek !== 0,
      openTime: DEFAULT_OPEN,
      closeTime: DEFAULT_CLOSE
    };
  });

const DEFAULT_DAY_LABELS: ReadonlyArray<string> = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CreateRestaurantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  models: ReadonlyArray<RestaurantModelDef>;
  defaultModelId: string;
  labels: CreateRestaurantDialogLabels;
  loading?: boolean;
  error?: string | null;
  onSubmit: (values: CreateRestaurantValues) => void;
  renderModelPreview?: (model: RestaurantModelDef, selected: boolean) => React.ReactNode;
}

const DEFAULT_MAX_COVERS = "60";
const MIN_NAME_LENGTH = 2;
const MIN_ADDRESS_LENGTH = 3;

const CreateRestaurantDialog = ({
  open,
  onOpenChange,
  models,
  defaultModelId,
  labels,
  loading = false,
  error = null,
  onSubmit,
  renderModelPreview
}: CreateRestaurantDialogProps): React.JSX.Element => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [maxCovers, setMaxCovers] = useState(DEFAULT_MAX_COVERS);
  const [modelId, setModelId] = useState(defaultModelId);
  const [openingHours, setOpeningHours] = useState<OpeningHourDraft[]>(buildDefaultDraft);

  const reset = (): void => {
    setName("");
    setAddress("");
    setPhone("");
    setMaxCovers(DEFAULT_MAX_COVERS);
    setModelId(defaultModelId);
    setOpeningHours(buildDefaultDraft());
  };

  const updateHour = (dayOfWeek: number, patch: Partial<OpeningHourDraft>): void => {
    setOpeningHours((prev) => prev.map((h) => (h.dayOfWeek === dayOfWeek ? { ...h, ...patch } : h)));
  };

  const handleOpenChange = (next: boolean): void => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const covers = parseInt(maxCovers, 10);

    if (
      name.trim().length < MIN_NAME_LENGTH ||
      address.trim().length < MIN_ADDRESS_LENGTH ||
      phone.trim().length === 0 ||
      Number.isNaN(covers) ||
      covers <= 0
    ) {
      return;
    }

    onSubmit({
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
      maxCovers: covers,
      modelId,
      openingHours
    });
  };

  const dayLabels = labels.dayLabels ?? DEFAULT_DAY_LABELS;

  const covers = parseInt(maxCovers, 10);
  const isFormValid =
    name.trim().length >= MIN_NAME_LENGTH &&
    address.trim().length >= MIN_ADDRESS_LENGTH &&
    phone.trim().length > 0 &&
    !Number.isNaN(covers) &&
    covers > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="scrollbar-hidden max-h-[calc(100vh_-_2rem)] w-[36rem] max-w-[calc(100vw_-_2rem)] overflow-y-auto md:w-[44rem] lg:w-[52rem]">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <form id="create-restaurant-form" onSubmit={handleSubmit} className="gap-md flex flex-col">
          <div className="gap-xs flex flex-col">
            <Label htmlFor="create-restaurant-name">{labels.nameLabel}</Label>
            <Input
              id="create-restaurant-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={labels.namePlaceholder}
              autoFocus
              required
            />
          </div>

          <div className="gap-xs flex flex-col">
            <Label htmlFor="create-restaurant-address">{labels.addressLabel}</Label>
            <Input
              id="create-restaurant-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder={labels.addressPlaceholder}
              required
            />
          </div>

          <div className="gap-sm grid grid-cols-2">
            <div className="gap-xs flex flex-col">
              <Label htmlFor="create-restaurant-phone">{labels.phoneLabel}</Label>
              <Input
                id="create-restaurant-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={labels.phonePlaceholder}
                required
              />
            </div>

            <div className="gap-xs flex flex-col">
              <Label htmlFor="create-restaurant-covers">{labels.maxCoversLabel}</Label>
              <Input
                id="create-restaurant-covers"
                type="number"
                min={1}
                value={maxCovers}
                onChange={(event) => setMaxCovers(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="gap-xs flex flex-col">
            <Label>{labels.modelLabel}</Label>
            <div className="gap-sm grid grid-cols-3">
              {models.map((model) => {
                const selected = model.id === modelId;

                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setModelId(model.id)}
                    aria-pressed={selected}
                    className={cn(
                      "group gap-xs flex aspect-square flex-col items-center justify-end overflow-hidden rounded-lg border p-2 transition-all",
                      selected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-muted/30 hover:bg-muted/60"
                    )}
                  >
                    <div
                      aria-hidden
                      className={cn(
                        "relative w-full flex-1 overflow-hidden rounded-md transition-transform",
                        !renderModelPreview && (selected ? "bg-primary/40" : "bg-muted"),
                        "group-hover:scale-105"
                      )}
                    >
                      {renderModelPreview ? renderModelPreview(model, selected) : null}
                    </div>
                    <span className={cn("typo-caption text-center", selected ? "text-primary" : "text-muted-foreground")}>
                      {model.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {labels.openingHoursLabel ? (
            <div className="gap-xs flex flex-col">
              <Label>{labels.openingHoursLabel}</Label>
              <div className="gap-2xs flex flex-col">
                {openingHours.map((h) => (
                  <div key={h.dayOfWeek} className="gap-sm grid grid-cols-[3rem_auto_auto_auto] items-center">
                    <span className="text-foreground typo-caption">{dayLabels[h.dayOfWeek]}</span>
                    <Switch checked={h.isOpen} onCheckedChange={(v) => updateHour(h.dayOfWeek, { isOpen: v })} />
                    <Input
                      type="time"
                      disabled={!h.isOpen}
                      value={h.openTime}
                      onChange={(e) => updateHour(h.dayOfWeek, { openTime: e.target.value })}
                      className="w-28 [color-scheme:dark]"
                    />
                    <Input
                      type="time"
                      disabled={!h.isOpen}
                      value={h.closeTime}
                      onChange={(e) => updateHour(h.dayOfWeek, { closeTime: e.target.value })}
                      className="w-28 [color-scheme:dark]"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {error ? <p className="text-destructive typo-caption">{error}</p> : null}
        </form>

        <div className="gap-xs flex justify-end">
          <DialogClose render={<Button type="button" variant="outline" disabled={loading} />}>
            {labels.cancel}
          </DialogClose>
          <Button type="submit" form="create-restaurant-form" disabled={loading || !isFormValid}>
            {labels.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { CreateRestaurantDialog };

export type { CreateRestaurantDialogProps, CreateRestaurantDialogLabels, CreateRestaurantValues };
