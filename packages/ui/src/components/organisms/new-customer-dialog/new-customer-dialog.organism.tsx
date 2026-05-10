import React, { useState } from "react";

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
  emailLabel: string;
  emailPlaceholder: string;
  tagLabel: string;
  tagVip: string;
  tagRegular: string;
  tagNew: string;
  cancel: string;
  submit: string;
}

interface NewCustomerFormValues {
  name: string;
  email: string;
  tag: CustomerTag;
}

interface NewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: NewCustomerDialogLabels;
  onSubmit: (values: NewCustomerFormValues) => void;
}

const DEFAULT_TAG: CustomerTag = "New";

const NewCustomerDialog = ({
  open,
  onOpenChange,
  labels,
  onSubmit
}: NewCustomerDialogProps): React.JSX.Element => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tag, setTag] = useState<CustomerTag>(DEFAULT_TAG);

  const reset = (): void => {
    setName("");
    setEmail("");
    setTag(DEFAULT_TAG);
  };

  const handleOpenChange = (next: boolean): void => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName === "" || trimmedEmail === "") return;

    onSubmit({ name: trimmedName, email: trimmedEmail, tag });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-md flex flex-col">
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <form id="new-customer-form" onSubmit={handleSubmit} className="gap-sm flex flex-col">
          <div className="gap-xs flex flex-col">
            <Label htmlFor="new-customer-name">{labels.nameLabel}</Label>
            <Input
              id="new-customer-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={labels.namePlaceholder}
              required
            />
          </div>

          <div className="gap-xs flex flex-col">
            <Label htmlFor="new-customer-email">{labels.emailLabel}</Label>
            <Input
              id="new-customer-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={labels.emailPlaceholder}
              required
            />
          </div>

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
        </form>

        <div className="gap-xs flex justify-end">
          <DialogClose render={<Button type="button" variant="outline" />}>
            {labels.cancel}
          </DialogClose>
          <Button type="submit" form="new-customer-form">
            {labels.submit}
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
