import React from "react";

import { cn } from "@/lib/utils";

interface ControlTipProps {
  className?: string;
  children: React.ReactNode;
}

const ControlTip = ({ className, children }: ControlTipProps): React.JSX.Element => (
  <div
    role="note"
    className={cn(
      "glass text-muted-foreground typo-caption gap-xs px-sm py-xs pointer-events-none inline-flex items-center rounded-full whitespace-nowrap",
      className
    )}
  >
    {children}
  </div>
);

export { ControlTip };

export type { ControlTipProps };
