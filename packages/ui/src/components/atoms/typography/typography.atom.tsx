import React from "react";

import { cn } from "@/lib/utils";

const Display = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"h1">): React.JSX.Element => (
  <h1 className={cn("typo-display", className)} {...props}>
    {children}
  </h1>
);

const H1 = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"h1">): React.JSX.Element => (
  <h1 className={cn("typo-h1 scroll-m-20", className)} {...props}>
    {children}
  </h1>
);

const H2 = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"h2">): React.JSX.Element => (
  <h2 className={cn("typo-h2 scroll-m-20", className)} {...props}>
    {children}
  </h2>
);

const H3 = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"h3">): React.JSX.Element => (
  <h3 className={cn("typo-h3 scroll-m-20", className)} {...props}>
    {children}
  </h3>
);

const H4 = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"h4">): React.JSX.Element => (
  <h4 className={cn("typo-h4 scroll-m-20", className)} {...props}>
    {children}
  </h4>
);

const H5 = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"h5">): React.JSX.Element => (
  <h5 className={cn("typo-h5 scroll-m-20", className)} {...props}>
    {children}
  </h5>
);

const P = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"p">): React.JSX.Element => (
  <p className={cn("typo-body [&:not(:first-child)]:mt-6", className)} {...props}>
    {children}
  </p>
);

const Lead = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"p">): React.JSX.Element => (
  <p className={cn("typo-body-lg text-muted-foreground", className)} {...props}>
    {children}
  </p>
);

const Large = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"div">): React.JSX.Element => (
  <div className={cn("typo-body-lg font-semibold", className)} {...props}>
    {children}
  </div>
);

const Small = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"small">): React.JSX.Element => (
  <small className={cn("typo-body-sm leading-none font-medium", className)} {...props}>
    {children}
  </small>
);

const Muted = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"p">): React.JSX.Element => (
  <p className={cn("typo-body-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
);

const Caption = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"span">): React.JSX.Element => (
  <span className={cn("typo-caption text-muted-foreground", className)} {...props}>
    {children}
  </span>
);

const Overline = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"span">): React.JSX.Element => (
  <span className={cn("typo-overline text-muted-foreground", className)} {...props}>
    {children}
  </span>
);

const Blockquote = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"blockquote">): React.JSX.Element => (
  <blockquote className={cn("typo-body-lg border-border mt-6 border-l-4 pl-6 italic", className)} {...props}>
    {children}
  </blockquote>
);

const InlineCode = ({ className, children, ...props }: React.ComponentPropsWithoutRef<"code">): React.JSX.Element => (
  <code
    className={cn("typo-code bg-muted relative rounded-sm px-[0.3rem] py-[0.2rem]", className)}
    {...props}
  >
    {children}
  </code>
);

export { Display, H1, H2, H3, H4, H5, P, Lead, Large, Small, Muted, Caption, Overline, Blockquote, InlineCode };
