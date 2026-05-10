import React, { useEffect, useState } from "react";

import type { CustomerTag } from "@workspace/client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface NewCustomerDialogLabels {
  title: string;
  description: string;
  nameLabel: string;
  namePlaceholder: string;
  firstNameLabel?: string;
  firstNamePlaceholder?: string;
  lastNameLabel?: string;
  lastNamePlaceholder?: string;
  emailLabel: string;
  emailPlaceholder: string;
  tagLabel: string;
  tagVip: string;
  tagRegular: string;
  tagNew: string;
  cancel: string;
  submit: string;
  editTitle?: string;
  editDescription?: string;
  editSubmit?: string;
}

interface NewCustomerFormValues {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  tag: CustomerTag;
}

interface NewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: NewCustomerDialogLabels;
  onSubmit: (values: NewCustomerFormValues) => void;
  mode?: "create" | "edit";
  initialValues?: NewCustomerFormValues;
}

const DEFAULT_TAG: CustomerTag = "New";

const NewCustomerDialog = ({
  open,
  onOpenChange,
  labels,
  onSubmit,
  mode = "create",
  initialValues
}: NewCustomerDialogProps): React.JSX.Element => {
  const [firstName, setFirstName] = useState(initialValues?.firstName ?? "");
  const [lastName, setLastName] = useState(initialValues?.lastName ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [tag, setTag] = useState<CustomerTag>(initialValues?.tag ?? DEFAULT_TAG);

  useEffect(() => {
    if (open) {
      setFirstName(initialValues?.firstName ?? "");
      setLastName(initialValues?.lastName ?? "");
      setEmail(initialValues?.email ?? "");
      setTag(initialValues?.tag ?? DEFAULT_TAG);
    }
  }, [open, initialValues]);

  const reset = (): void => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setTag(DEFAULT_TAG);
  };

  const handleOpenChange = (next: boolean): void => {
    if (!next && mode === "create") reset();
    onOpenChange(next);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();

    if (trimmedFirst === "" || trimmedLast === "") return;

    onSubmit({
      name: `${trimmedFirst} ${trimmedLast}`.trim(),
      firstName: trimmedFirst,
      lastName: trimmedLast,
      email: trimmedEmail,
      tag
    });
    if (mode === "create") reset();
    onOpenChange(false);
  };

  const isEdit = mode === "edit";
  const dialogTitle = isEdit && labels.editTitle ? labels.editTitle : labels.title;
  const dialogDescription = isEdit && labels.editDescription ? labels.editDescription : labels.description;
  const submitLabel = isEdit && labels.editSubmit ? labels.editSubmit : labels.submit;
  const firstNameLabel = labels.firstNameLabel ?? labels.nameLabel;
  const firstNamePlaceholder = labels.firstNamePlaceholder ?? labels.namePlaceholder;
  const lastNameLabel = labels.lastNameLabel ?? labels.nameLabel;
  const lastNamePlaceholder = labels.lastNamePlaceholder ?? labels.namePlaceholder;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-md flex flex-col">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <form id="new-customer-form" onSubmit={handleSubmit} className="gap-sm flex flex-col">
          <div className="gap-sm grid grid-cols-2">
            <div className="gap-xs flex flex-col">
              <Label htmlFor="new-customer-first-name">{firstNameLabel}</Label>
              <Input
                id="new-customer-first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder={firstNamePlaceholder}
                required
              />
            </div>
            <div className="gap-xs flex flex-col">
              <Label htmlFor="new-customer-last-name">{lastNameLabel}</Label>
              <Input
                id="new-customer-last-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder={lastNamePlaceholder}
                required
              />
            </div>
          </div>

          <div className="gap-xs flex flex-col">
            <Label htmlFor="new-customer-email">{labels.emailLabel}</Label>
            <Input
              id="new-customer-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={labels.emailPlaceholder}
            />
          </div>

          {isEdit ? (
            <div className="gap-xs flex flex-col">
              <Label htmlFor="new-customer-tag">{labels.tagLabel}</Label>
              <Select
                value={tag}
                onValueChange={(value) => { if (value !== null) setTag(value as CustomerTag); }}
              >
                <SelectTrigger id="new-customer-tag" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">{labels.tagNew}</SelectItem>
                  <SelectItem value="Regular">{labels.tagRegular}</SelectItem>
                  <SelectItem value="VIP">{labels.tagVip}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </form>

        <div className="gap-xs flex justify-end">
          <DialogClose render={<Button type="button" variant="outline" />}>
            {labels.cancel}
          </DialogClose>
          <Button type="submit" form="new-customer-form">
            {submitLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { NewCustomerDialog };

export type {
  NewCustomerDialogProps,
  NewCustomerDialogLabels,
  NewCustomerFormValues
};
