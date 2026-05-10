import React, { useMemo, useState } from "react";

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

interface RestaurantPickerDialogLabels {
  title: string;
  description: string;
  searchPlaceholder: string;
  empty: string;
  cancel: string;
  submit: string;
}

interface RestaurantPickerOption {
  id: string;
  name: string;
  address?: string;
}

interface RestaurantPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: RestaurantPickerDialogLabels;
  restaurants: ReadonlyArray<RestaurantPickerOption>;
  onSelect: (restaurantId: string) => void;
}

const RestaurantPickerDialog = ({
  open,
  onOpenChange,
  labels,
  restaurants,
  onSelect
}: RestaurantPickerDialogProps): React.JSX.Element => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return restaurants;

    return restaurants.filter((r) =>
      r.name.toLowerCase().includes(q) ||
        (r.address ?? "").toLowerCase().includes(q));
  }, [restaurants, search]);

  const handleConfirm = (): void => {
    if (!selectedId) return;
    onSelect(selectedId);
    onOpenChange(false);
    setSearch("");
    setSelectedId(null);
  };

  const handleOpenChange = (next: boolean): void => {
    if (!next) {
      setSearch("");
      setSelectedId(null);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-md flex max-w-md flex-col">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <Input
          placeholder={labels.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="border-border max-h-72 overflow-y-auto rounded-md border">
          {filtered.length === 0 ? (
            <div className="text-muted-foreground p-md text-center text-sm">
              {labels.empty}
            </div>
          ) : (
            <ul className="divide-border divide-y">
              {filtered.map((r) => {
                const isSelected = selectedId === r.id;

                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(r.id)}
                      className={`px-md py-sm hover:bg-muted flex w-full items-center justify-between text-left transition-colors ${
                        isSelected ? "bg-primary/10" : ""
                      }`}
                    >
                      <span className="flex flex-col">
                        <span className="text-sm font-medium">{r.name}</span>
                        {r.address ? (
                          <span className="text-muted-foreground text-xs">
                            {r.address}
                          </span>
                        ) : null}
                      </span>
                      <span
                        aria-hidden
                        className={`flex size-4 items-center justify-center rounded-full border transition-colors ${
                          isSelected ? "border-primary bg-primary" : "border-border"
                        }`}
                      >
                        {isSelected ? (
                          <span className="bg-primary-foreground size-1.5 rounded-full" />
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="gap-xs flex justify-end">
          <DialogClose render={<Button type="button" variant="outline" />}>
            {labels.cancel}
          </DialogClose>
          <Button type="button" onClick={handleConfirm} disabled={!selectedId}>
            {labels.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { RestaurantPickerDialog };

export type {
  RestaurantPickerDialogLabels,
  RestaurantPickerDialogProps,
  RestaurantPickerOption
};
