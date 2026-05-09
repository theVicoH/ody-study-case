import React from "react";

import {
  Blockquote,
  Caption,
  Display,
  H1,
  H2,
  H3,
  H4,
  H5,
  InlineCode,
  Large,
  Lead,
  Muted,
  Overline,
  P,
  Small
} from "./typography.atom";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/Atoms/Typography",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Fluid typography system built on CSS `@utility typo-*` design tokens.",
          "",
          "**Font families**",
          "- Headings: `Space Grotesk Variable` (fallback: `Inter Variable`)",
          "- Body / UI: `Inter Variable`",
          "- Code: `ui-monospace`",
          "",
          "**Fluid scaling** — headings use `clamp(min, fluid, max)` so they scale",
          "smoothly between mobile (≈320 px) and desktop (≈1440 px) without breakpoints.",
          "Body tokens stay fixed for readability.",
          "",
          "| Token | Mobile | Desktop |",
          "|-------|--------|---------|",
          "| `typo-display` | 40 px | 60 px |",
          "| `typo-h1` | 28 px | 36 px |",
          "| `typo-h2` | 24 px | 30 px |",
          "| `typo-h3` | 20 px | 24 px |",
          "| `typo-h4` | 18 px | 20 px |",
          "| `typo-h5` | 16 px | 18 px |",
          "| `typo-body-lg` | 16 px | 18 px |",
          "| `typo-body` | 16 px | 16 px |",
          "| `typo-body-sm` | 14 px | 14 px |",
          "| `typo-caption` | 12 px | 12 px |",
          "| `typo-overline` | 12 px | 12 px |"
        ].join("\n")
      }
    }
  }
};

export default meta;

type Story = StoryObj;

export const DisplayStory: Story = {
  name: "Display",
  parameters: {
    docs: { description: { story: "Hero-level heading. `typo-display` — `clamp(2.5rem, 5vw + 1rem, 3.75rem)`, weight 700." } }
  },
  render: () => <Display>The quick brown fox jumps over the lazy dog</Display>
};

export const Heading1: Story = {
  parameters: {
    docs: { description: { story: "`typo-h1` — `clamp(1.75rem, 3vw + 0.5rem, 2.25rem)`, weight 700." } }
  },
  render: () => <H1>The quick brown fox jumps over the lazy dog</H1>
};

export const Heading2: Story = {
  parameters: {
    docs: { description: { story: "`typo-h2` — `clamp(1.5rem, 2.5vw + 0.25rem, 1.875rem)`, weight 700." } }
  },
  render: () => <H2>The quick brown fox jumps over the lazy dog</H2>
};

export const Heading3: Story = {
  parameters: {
    docs: { description: { story: "`typo-h3` — `clamp(1.25rem, 2vw + 0.125rem, 1.5rem)`, weight 600." } }
  },
  render: () => <H3>The quick brown fox jumps over the lazy dog</H3>
};

export const Heading4: Story = {
  parameters: {
    docs: { description: { story: "`typo-h4` — `clamp(1.125rem, 1.5vw + 0.125rem, 1.25rem)`, weight 600." } }
  },
  render: () => <H4>The quick brown fox jumps over the lazy dog</H4>
};

export const Heading5: Story = {
  parameters: {
    docs: { description: { story: "`typo-h5` — `clamp(1rem, 1.2vw + 0.125rem, 1.125rem)`, weight 600. Uses `font-sans`." } }
  },
  render: () => <H5>The quick brown fox jumps over the lazy dog</H5>
};

export const Paragraph: Story = {
  parameters: {
    docs: { description: { story: "`typo-body` — `1rem`, line-height 1.5." } }
  },
  render: () => (
    <P>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </P>
  )
};

export const LeadStory: Story = {
  name: "Lead",
  parameters: {
    docs: { description: { story: "`typo-body-lg` + `text-muted-foreground`. Introductory paragraph below a heading." } }
  },
  render: () => (
    <Lead>A modal dialog that interrupts the user with important content and expects a response.</Lead>
  )
};

export const LargeStory: Story = {
  name: "Large",
  parameters: {
    docs: { description: { story: "`typo-body-lg` + `font-semibold`. Emphasised body copy." } }
  },
  render: () => <Large>Are you absolutely sure?</Large>
};

export const SmallStory: Story = {
  name: "Small",
  parameters: {
    docs: { description: { story: "`typo-body-sm` + `font-medium`. Labels, form hints." } }
  },
  render: () => <Small>Email address</Small>
};

export const MutedStory: Story = {
  name: "Muted",
  parameters: {
    docs: { description: { story: "`typo-body-sm` + `text-muted-foreground`. Secondary text." } }
  },
  render: () => <Muted>Enter your email address.</Muted>
};

export const CaptionStory: Story = {
  name: "Caption",
  parameters: {
    docs: { description: { story: "`typo-caption` — `0.75rem`, weight 500. Image captions, table helpers." } }
  },
  render: () => <Caption>Last updated 3 minutes ago</Caption>
};

export const OverlineStory: Story = {
  name: "Overline",
  parameters: {
    docs: { description: { story: "`typo-overline` — `0.75rem`, `letter-spacing: 0.08em`, uppercase. Section labels." } }
  },
  render: () => <Overline>Category · French cuisine</Overline>
};

export const BlockquoteStory: Story = {
  name: "Blockquote",
  parameters: {
    docs: { description: { story: "Left-bordered quote block using `typo-body-lg`." } }
  },
  render: () => (
    <Blockquote>
      After all, the best way to attract luck is to be prepared for it.
    </Blockquote>
  )
};

export const Code: Story = {
  parameters: {
    docs: { description: { story: "`typo-code` — monospace, `0.875rem`. Inline code within prose." } }
  },
  render: () => (
    <P>
      Use the <InlineCode>npm install</InlineCode> command to install dependencies.
    </P>
  )
};

export const AllVariants: Story = {
  name: "Scale overview",
  parameters: {
    docs: { description: { story: "Full type scale from Display down to Overline." } }
  },
  render: () => (
    <div className="space-y-4">
      <div className="space-y-1">
        <Overline>display</Overline>
        <Display>Display heading</Display>
      </div>
      <div className="space-y-1">
        <Overline>h1</Overline>
        <H1>Heading 1</H1>
      </div>
      <div className="space-y-1">
        <Overline>h2</Overline>
        <H2>Heading 2</H2>
      </div>
      <div className="space-y-1">
        <Overline>h3</Overline>
        <H3>Heading 3</H3>
      </div>
      <div className="space-y-1">
        <Overline>h4</Overline>
        <H4>Heading 4</H4>
      </div>
      <div className="space-y-1">
        <Overline>h5</Overline>
        <H5>Heading 5</H5>
      </div>
      <div className="space-y-1">
        <Overline>lead</Overline>
        <Lead>Lead paragraph text</Lead>
      </div>
      <div className="space-y-1">
        <Overline>body</Overline>
        <P>Regular paragraph text with normal line height and spacing.</P>
      </div>
      <div className="space-y-1">
        <Overline>large</Overline>
        <Large>Large text variant</Large>
      </div>
      <div className="space-y-1">
        <Overline>small</Overline>
        <Small>Small text variant</Small>
      </div>
      <div className="space-y-1">
        <Overline>muted</Overline>
        <Muted>Muted text for secondary information</Muted>
      </div>
      <div className="space-y-1">
        <Overline>caption</Overline>
        <Caption>Caption text — timestamps, hints</Caption>
      </div>
      <div className="space-y-1">
        <Overline>overline</Overline>
        <Overline>Section label · uppercase</Overline>
      </div>
      <div className="space-y-1">
        <Overline>blockquote</Overline>
        <Blockquote>A blockquote for important citations or quotes.</Blockquote>
      </div>
      <div className="space-y-1">
        <Overline>inline code</Overline>
        <P>
          Inline code: <InlineCode>const x = 42;</InlineCode>
        </P>
      </div>
    </div>
  )
};
