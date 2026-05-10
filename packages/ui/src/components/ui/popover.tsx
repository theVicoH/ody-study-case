import * as React from "react";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const SIDE_OFFSET = 6;

interface PopoverContentProps extends React.ComponentProps<typeof PopoverPrimitive.Popup> {
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

const PopoverContent = ({
  className,
  align = "center",
  side = "bottom",
  sideOffset = SIDE_OFFSET,
  ...props
}: PopoverContentProps): React.JSX.Element => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Positioner align={align} side={side} sideOffset={sideOffset}>
      <PopoverPrimitive.Popup
        className={cn(
          `bg-popover text-popover-foreground border-border z-50 rounded-2xl border p-2 shadow-xl
          outline-none
          data-[ending-style]:opacity-0 data-[ending-style]:scale-95
          data-[starting-style]:opacity-0 data-[starting-style]:scale-95
          transition-all duration-150 ease-out`,
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Positioner>
  </PopoverPrimitive.Portal>
);

export { Popover, PopoverContent, PopoverTrigger };
