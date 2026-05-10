import React, { useEffect, useState } from "react";

import { Muted } from "@/components/atoms/typography/typography.atom";
import { TrashIcon } from "@/components/icons/trash/trash.icon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SAVE_FEEDBACK_DURATION_MS = 2000;
const TRASH_ICON_SIZE = 14;

export interface SheetOrganizationSettingsLabels {
  generalInfo: string;
  orgName: string;
  owner: string;
  restaurants: string;
  restaurantsEmpty: string;
  deleteRestaurant: string;
  deleteRestaurantDesc: string;
  deleteOrg: string;
  deleteOrgDesc: string;
  dangerZone: string;
  cancel: string;
  confirm: string;
  save: string;
  saved: string;
}

export interface OrgRestaurantItem {
  id: string;
  name: string;
  address: string;
}

export interface SheetOrganizationSettingsProps {
  labels: SheetOrganizationSettingsLabels;
  orgName: string;
  ownerEmail: string;
  restaurants: ReadonlyArray<OrgRestaurantItem>;
  onSave?: (name: string) => Promise<void> | void;
  onDeleteRestaurant?: (id: string) => Promise<void> | void;
  onDeleteOrganization?: () => Promise<void> | void;
}

interface ConfirmDialogProps {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  trigger: React.ReactNode;
  destructive?: boolean;
  onConfirm: () => void;
}

const ConfirmDialog = ({
  title,
  description,
  cancelLabel,
  confirmLabel,
  trigger,
  destructive = false,
  onConfirm
}: ConfirmDialogProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleConfirm = (): void => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<span />}>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<button type="button" className="border-border text-foreground hover:bg-muted/50 px-md py-xs typo-button rounded-md border bg-transparent transition-colors" />}>
            {cancelLabel}
          </DialogClose>
          <button
            type="button"
            onClick={handleConfirm}
            className={cn(
              "px-md py-xs typo-button rounded-md transition-all",
              destructive
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "bg-primary text-primary-foreground hover:opacity-90"
            )}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SheetOrganizationSettings = ({
  labels,
  orgName,
  ownerEmail,
  restaurants,
  onSave,
  onDeleteRestaurant,
  onDeleteOrganization
}: SheetOrganizationSettingsProps): React.JSX.Element => {
  const [name, setName] = useState(orgName);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(orgName);
  }, [orgName]);

  const isDirty = name.trim() !== orgName && name.trim().length >= 2;

  const handleSave = async (): Promise<void> => {
    if (!isDirty || !onSave) return;
    await onSave(name.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), SAVE_FEEDBACK_DURATION_MS);
  };

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>{labels.generalInfo}</CardTitle>
            <button
              type="button"
              onClick={() => { void handleSave(); }}
              disabled={!isDirty && !saved}
              className={cn(
                "px-sm py-2xs typo-caption rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed",
                saved
                  ? "bg-status-good/20 text-status-good"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              )}
            >
              {saved ? labels.saved : labels.save}
            </button>
          </div>
        </CardHeader>
        <CardContent className="gap-md flex flex-col">
          <div className="gap-xs flex flex-col">
            <label className="text-muted-foreground typo-overline">{labels.orgName}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
            />
          </div>

          <div className="gap-xs flex flex-col">
            <label className="text-muted-foreground typo-overline">{labels.owner}</label>
            <Muted className="typo-body-sm">{ownerEmail}</Muted>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{labels.restaurants}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {restaurants.length === 0 ? (
            <p className="text-muted-foreground typo-caption px-md py-md text-center">
              {labels.restaurantsEmpty}
            </p>
          ) : (
            <ul>
              {restaurants.map((r) => (
                <li
                  key={r.id}
                  className="border-border flex items-center justify-between border-b px-md py-sm last:border-0"
                >
                  <div className="gap-2xs flex min-w-0 flex-col">
                    <p className="text-foreground typo-button truncate">{r.name}</p>
                    <Muted className="typo-caption truncate">{r.address}</Muted>
                  </div>
                  {onDeleteRestaurant ? (
                    <ConfirmDialog
                      title={labels.deleteRestaurant}
                      description={labels.deleteRestaurantDesc.replace("{{name}}", r.name)}
                      cancelLabel={labels.cancel}
                      confirmLabel={labels.confirm}
                      destructive
                      onConfirm={() => { void onDeleteRestaurant(r.id); }}
                      trigger={
                        <button
                          type="button"
                          aria-label={labels.deleteRestaurant}
                          className="text-muted-foreground hover:text-destructive ml-sm size-xl shrink-0 inline-flex items-center justify-center rounded-sm transition-colors"
                        >
                          <TrashIcon size={TRASH_ICON_SIZE} />
                        </button>
                      }
                    />
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader className="border-b">
          <CardTitle className="text-destructive">{labels.dangerZone}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-xs gap-sm flex items-center justify-between">
            <div className="gap-xs flex flex-col">
              <p className="text-foreground typo-button">{labels.deleteOrg}</p>
              <Muted className="typo-caption">{labels.deleteOrgDesc}</Muted>
            </div>
            {onDeleteOrganization ? (
              <ConfirmDialog
                title={labels.deleteOrg}
                description={labels.deleteOrgDesc}
                cancelLabel={labels.cancel}
                confirmLabel={labels.confirm}
                destructive
                onConfirm={() => { void onDeleteOrganization(); }}
                trigger={
                  <button
                    type="button"
                    className="bg-destructive/10 text-destructive hover:bg-destructive/20 px-md py-xs typo-button shrink-0 rounded-md transition-all"
                  >
                    {labels.deleteOrg}
                  </button>
                }
              />
            ) : null}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export { SheetOrganizationSettings };
