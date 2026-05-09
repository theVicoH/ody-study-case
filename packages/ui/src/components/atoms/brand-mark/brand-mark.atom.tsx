import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const brandMarkVariants = cva(
  "inline-block w-auto shrink-0 object-contain",
  {
    variants: {
      size: {
        sm: "h-6",
        md: "h-8",
        lg: "h-10"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);

interface BrandMarkProps extends VariantProps<typeof brandMarkVariants> {
  className?: string;
  label?: string;
}

const BrandMark = ({ size, className, label }: BrandMarkProps): React.JSX.Element => (
  <img
    src="/images/logo.png"
    alt={label ?? "Brand"}
    className={cn(brandMarkVariants({ size }), className)}
  />
);

export { BrandMark, brandMarkVariants };

export type { BrandMarkProps };
