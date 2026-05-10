import React, { useEffect, useState } from "react";

import { StatusDot } from "@/components/atoms/status-dot/status-dot.atom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface SplitRestaurantOption {
  id: string;
  name: string;
  status: "good" | "warn" | "bad" | "disabled";
}

interface SplitPageOption {
  id: string;
  label: string;
}

interface CreateSplitDialogLabels {
  title: string;
  description: string;
  restaurantLabel: string;
  pageLabel: string;
  cancel: string;
  submit: string;
}

interface CreateSplitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurants: ReadonlyArray<SplitRestaurantOption>;
  pages: ReadonlyArray<SplitPageOption>;
  defaultRestaurantId?: string;
  defaultPageId?: string;
  labels: CreateSplitDialogLabels;
  onSubmit: (values: { restaurantId: string; pageId: string }) => void;
}

const CreateSplitDialog = ({
  open,
  onOpenChange,
  restaurants,
  pages,
  defaultRestaurantId,
  defaultPageId,
  labels,
  onSubmit
}: CreateSplitDialogProps): React.JSX.Element => {
  const [restaurantId, setRestaurantId] = useState<string>(
    defaultRestaurantId ?? restaurants[0]?.id ?? ""
  );
  const [pageId, setPageId] = useState<string>(defaultPageId ?? pages[0]?.id ?? "");

  useEffect(() => {
    if (open) {
      setRestaurantId(defaultRestaurantId ?? restaurants[0]?.id ?? "");
      setPageId(defaultPageId ?? pages[0]?.id ?? "");
    }
  }, [open, defaultRestaurantId, defaultPageId, restaurants, pages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!restaurantId || !pageId) return;
    onSubmit({ restaurantId, pageId });
  };

  const selectedRestaurant = restaurants.find((r) => r.id === restaurantId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-md w-[26rem]">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="gap-md flex flex-col">
          <div className="gap-2xs flex flex-col">
            <Label htmlFor="split-restaurant">{labels.restaurantLabel}</Label>
            <Select value={restaurantId} onValueChange={(v) => v && setRestaurantId(v)}>
              <SelectTrigger id="split-restaurant" size="sm">
                <SelectValue>
                  {(id: string) => {
                    const r = restaurants.find((it) => it.id === id);

                    return r ? (
                      <span className="gap-2xs flex items-center">
                        <StatusDot status={r.status} size="sm" />
                        {r.name}
                      </span>
                    ) : id;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {restaurants.map((r) => (
                  <SelectItem key={r.id} value={r.id} label={r.name}>
                    <StatusDot status={r.status} size="sm" />
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="gap-2xs flex flex-col">
            <Label htmlFor="split-page">{labels.pageLabel}</Label>
            <Select value={pageId} onValueChange={(v) => v && setPageId(v)}>
              <SelectTrigger id="split-page" size="sm">
                <SelectValue>
                  {(id: string) => pages.find((p) => p.id === id)?.label ?? id}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {pages.map((p) => (
                  <SelectItem key={p.id} value={p.id} label={p.label}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="gap-xs mt-xs flex justify-end">
            <DialogClose
              render={<Button type="button" variant="ghost">{labels.cancel}</Button>}
            />
            <Button type="submit" disabled={!restaurantId || !pageId || !selectedRestaurant}>
              {labels.submit}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { CreateSplitDialog };

export type {
  CreateSplitDialogProps,
  CreateSplitDialogLabels,
  SplitRestaurantOption,
  SplitPageOption
};
