import React from "react";

import { Container } from "./container.atom";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Container> = {
  title: "Atoms/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "responsive"
    }
  }
};

export default meta;

type Story = StoryObj<typeof Container>;

const Inner = (): React.JSX.Element => (
  <div className="bg-muted text-muted-foreground rounded-md p-4 text-sm">
    Content
  </div>
);

export const Default: Story = {
  render: () => (
    <Container>
      <Inner />
    </Container>
  )
};

export const Small: Story = {
  render: () => (
    <Container size="sm">
      <Inner />
    </Container>
  )
};

export const Large: Story = {
  render: () => (
    <Container size="2xl">
      <Inner />
    </Container>
  )
};

export const Full: Story = {
  render: () => (
    <Container size="full">
      <Inner />
    </Container>
  )
};

export const NoPadding: Story = {
  render: () => (
    <Container padding="none">
      <Inner />
    </Container>
  )
};

export const LargePadding: Story = {
  render: () => (
    <Container padding="lg">
      <Inner />
    </Container>
  )
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" }
  },
  render: () => (
    <Container>
      <Inner />
    </Container>
  )
};

export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: "tablet" }
  },
  render: () => (
    <Container>
      <Inner />
    </Container>
  )
};

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: "desktop" }
  },
  render: () => (
    <Container>
      <Inner />
    </Container>
  )
};
