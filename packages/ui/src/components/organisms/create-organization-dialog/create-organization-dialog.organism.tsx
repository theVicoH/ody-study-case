import React, { useState } from "react";

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

interface CreateOrganizationDialogLabels {
  title: string;
  description: string;
  nameLabel: string;
  namePlaceholder: string;
  cancel: string;
  submit: string;
}

interface CreateOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: CreateOrganizationDialogLabels;
  loading?: boolean;
  error?: string | null;
  onSubmit: (name: string) => void;
}

const MIN_NAME_LENGTH = 2;

const CreateOrganizationDialog = ({
  open,
  onOpenChange,
  labels,
  loading = false,
  error = null,
  onSubmit
}: CreateOrganizationDialogProps): React.JSX.Element => {
  const [name, setName] = useState("");

  const handleOpenChange = (next: boolean): void => {
    if (!next) setName("");
    onOpenChange(next);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = name.trim();

    if (trimmed.length < MIN_NAME_LENGTH) return;
    onSubmit(trimmed);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <form id="create-organization-form" onSubmit={handleSubmit} className="gap-md flex flex-col">
          <div className="gap-xs flex flex-col">
            <Label htmlFor="create-organization-name">{labels.nameLabel}</Label>
            <Input
              id="create-organization-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={labels.namePlaceholder}
              autoFocus
              required
            />
          </div>
          {error ? <p className="text-destructive typo-caption">{error}</p> : null}
        </form>

        <div className="gap-xs flex justify-end">
          <DialogClose render={<Button type="button" variant="outline" disabled={loading} />}>
            {labels.cancel}
          </DialogClose>
          <Button type="submit" form="create-organization-form" disabled={loading || name.trim().length < MIN_NAME_LENGTH}>
            {labels.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { CreateOrganizationDialog };

export type { CreateOrganizationDialogProps, CreateOrganizationDialogLabels };
