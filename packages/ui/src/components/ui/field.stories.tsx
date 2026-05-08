import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet
} from "./field";
import { Input } from "./input";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "UI/Field",
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  decorators: [
    (Story) => (
      <div className="mx-auto mt-20 w-full max-w-2xl">
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj;

export const Vertical: Story = {
  render: () => (
    <FieldGroup>
      <Field orientation="vertical">
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="you@example.com" />
      </Field>
    </FieldGroup>
  )
};

export const WithDescription: Story = {
  render: () => (
    <FieldGroup>
      <Field orientation="vertical">
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="you@example.com" />
        <FieldDescription>{"We'll never share your email."}</FieldDescription>
      </Field>
    </FieldGroup>
  )
};

export const WithError: Story = {
  render: () => (
    <FieldGroup>
      <Field orientation="vertical" data-invalid="true">
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="you@example.com" aria-invalid />
        <FieldError errors={[{ message: "Invalid email address" }]} />
      </Field>
    </FieldGroup>
  )
};

export const Horizontal: Story = {
  render: () => (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" type="text" placeholder="Your name" />
      </Field>
    </FieldGroup>
  )
};

export const FieldSetExample: Story = {
  render: () => (
    <FieldSet>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="first">First name</FieldLabel>
          <Input id="first" type="text" placeholder="First" />
        </Field>
        <Field>
          <FieldLabel htmlFor="last">Last name</FieldLabel>
          <Input id="last" type="text" placeholder="Last" />
        </Field>
      </FieldGroup>
    </FieldSet>
  )
};
