import * as React from "react";

import type { VariantProps } from "class-variance-authority";

import { ArrowLeftIcon } from "@/components/icons/arrow-left/arrow-left.icon";
import { ArrowRightIcon } from "@/components/icons/arrow-right/arrow-right.icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";



const PAGINATION_ICON_SIZE = 14;

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<VariantProps<typeof buttonVariants>, "size"> &
  React.ComponentProps<"button">;

function PaginationLink({
  className,
  isActive,
  size = "icon-sm",
  ...props
}: PaginationLinkProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label="Go to previous page"
      data-slot="pagination-previous"
      className={cn("gap-1", className)}
      {...props}
    >
      <ArrowLeftIcon size={PAGINATION_ICON_SIZE} />
      <span>{props.children}</span>
    </Button>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label="Go to next page"
      data-slot="pagination-next"
      className={cn("gap-1", className)}
      {...props}
    >
      <span>{props.children}</span>
      <ArrowRightIcon size={PAGINATION_ICON_SIZE} />
    </Button>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("text-muted-foreground flex size-8 items-center justify-center", className)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={PAGINATION_ICON_SIZE}
        height={PAGINATION_ICON_SIZE}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
};
