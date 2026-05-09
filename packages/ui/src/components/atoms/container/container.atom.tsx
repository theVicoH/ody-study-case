import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      "2xl": "max-w-screen-2xl",
      full: "max-w-full"
    },
    padding: {
      none: "",
      sm: "px-sm md:px-md lg:px-lg",
      md: "px-sm md:px-lg lg:px-xl",
      lg: "px-md md:px-xl lg:px-2xl"
    }
  },
  defaultVariants: {
    size: "xl",
    padding: "md"
  }
});

interface ContainerProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof containerVariants> {}

const Container = ({
  className,
  size,
  padding,
  children,
  ...props
}: ContainerProps): React.JSX.Element => {

  return (
    <div className={cn(containerVariants({ size, padding, className }))} {...props}>
      {children}
    </div>
  );
};

export { Container, containerVariants };
