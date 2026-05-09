import React from "react";

import { cn } from "@/lib/utils";

const KbdKey = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"kbd">): React.JSX.Element => (
  <kbd
    className={cn(
      "bg-foreground/10 text-foreground typo-code px-2xs py-3xs rounded-sm",
      className
    )}
    {...props}
  >
    {children}
  </kbd>
);

export { KbdKey };
