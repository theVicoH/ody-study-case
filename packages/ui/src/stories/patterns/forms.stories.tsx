import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const meta: Meta = {
  title: "Patterns/Forms",
  parameters: { layout: "centered" }
};

export default meta;

type Story = StoryObj;

export const SettingsForm: Story = {
  render: () => (
    <div className="gap-xl p-xl border-border bg-card flex w-full max-w-[32rem] flex-col rounded-2xl border">
      <div className="gap-xs flex flex-col">
        <h2 className="typo-h3 text-foreground">Restaurant settings</h2>
        <p className="typo-body-sm text-muted-foreground">Update your restaurant profile and preferences</p>
      </div>
      <div className="gap-md flex flex-col">
        <div className="gap-md grid grid-cols-2">
          <Field>
            <FieldLabel htmlFor="name">Restaurant name</FieldLabel>
            <Input id="name" defaultValue="Le Petit Bistrot" />
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input id="phone" type="tel" defaultValue="+33 1 23 45 67 89" />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <Input id="address" defaultValue="12 Rue de la Paix, 75001 Paris" />
        </Field>
        <div className="gap-md grid grid-cols-2">
          <Field>
            <FieldLabel htmlFor="cuisine">Cuisine type</FieldLabel>
            <Select>
              <SelectTrigger id="cuisine">
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="japanese">Japanese</SelectItem>
                <SelectItem value="fusion">Fusion</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
            <Input id="capacity" type="number" defaultValue="45" />
          </Field>
        </div>
      </div>
      <div className="gap-sm flex justify-end">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  )
};

export const Default: Story = SettingsForm;
