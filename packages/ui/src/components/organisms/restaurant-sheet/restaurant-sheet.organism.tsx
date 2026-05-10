import React, { useEffect } from "react";

import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";


import { StatusDot } from "@/components/atoms/status-dot/status-dot.atom";
import { H2, Muted, Overline } from "@/components/atoms/typography/typography.atom";
import { MaximizeIcon } from "@/components/icons/maximize/maximize.icon";
import { MinimizeIcon } from "@/components/icons/minimize/minimize.icon";
import { XIcon } from "@/components/icons/x/x.icon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ICON_SIZE = 16;
const SHEET_DEFAULT_WIDTH = 480;
const SHEET_EASE: [number, number, number, number] = [0.2, 0, 0, 1];
const SHEET_DURATION = 0.22;

interface RestaurantSelectorItem {
  id: string;
  name: string;
  status: "good" | "warn" | "bad" | "disabled";
}

interface RestaurantSheetProps {
  open: boolean;
  resizing?: boolean;
  expanded?: boolean;
  status: "good" | "warn" | "bad" | "disabled";
  eyebrow?: string;
  title: string;
  caption: string;
  closeLabel: string;
  expandLabel: string;
  collapseLabel: string;
  moveLabel: string;
  resizeLabel: string;
  width?: number | null;
  right?: number | null;
  tabSlot?: React.ReactNode;
  selectorRestaurants?: ReadonlyArray<RestaurantSelectorItem>;
  selectedRestaurantId?: string;
  onSelectRestaurant?: (id: string | null) => void;
  onClose: () => void;
  onToggleExpand?: () => void;
  onResizerLeftPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onResizerRightPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onDragHeaderPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
  className?: string;
}

const RestaurantSheet = React.forwardRef<HTMLElement, RestaurantSheetProps>(({
  open,
  resizing,
  expanded,
  status,
  eyebrow,
  title,
  caption,
  closeLabel,
  expandLabel,
  collapseLabel,
  moveLabel,
  resizeLabel,
  width,
  right,
  tabSlot,
  selectorRestaurants,
  selectedRestaurantId,
  onSelectRestaurant,
  onClose,
  onToggleExpand,
  onResizerLeftPointerDown,
  onResizerRightPointerDown,
  onDragHeaderPointerDown,
  children,
  className
}, ref): React.JSX.Element => {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (typeof document === "undefined") return null as unknown as React.JSX.Element;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.section
          ref={ref as React.Ref<HTMLElement>}
          role="complementary"
          initial={{ opacity: 0, x: "2rem" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "2rem" }}
          transition={{ duration: SHEET_DURATION, ease: SHEET_EASE }}
          className={cn(
            "glass-strong group fixed z-50 flex flex-col gap-0 overflow-hidden rounded-xl",
            resizing && "transition-none",
            className
          )}
          style={{
            width: `${width ?? SHEET_DEFAULT_WIDTH}px`,
            top: "var(--spacing-sm)",
            right: typeof right === "number" ? `${right}px` : "var(--spacing-sm)",
            bottom: "var(--spacing-sm)",
            height: "auto",
            maxWidth: "calc(100vw - 260px)"
          }}
          data-expanded={expanded ? "true" : undefined}
        >
          {onResizerLeftPointerDown && (
            <div
              onPointerDown={onResizerLeftPointerDown}
              aria-label={resizeLabel}
              role="separator"
              className="group/handle absolute top-0 bottom-0 left-0 z-20 flex w-sm cursor-ew-resize touch-none items-center justify-center select-none"
            >
              <span className="bg-foreground/20 group-hover/handle:bg-primary h-xl duration-base block w-2xs rounded-full transition-all group-hover/handle:h-16" />
            </div>
          )}

          {onResizerRightPointerDown && (
            <div
              onPointerDown={onResizerRightPointerDown}
              aria-label={resizeLabel}
              role="separator"
              className="group/handle absolute top-0 right-0 bottom-0 z-20 flex w-sm cursor-ew-resize touch-none items-center justify-center select-none"
            >
              <span className="bg-foreground/20 group-hover/handle:bg-primary h-xl duration-base block w-2xs rounded-full transition-all group-hover/handle:h-16" />
            </div>
          )}

          {onDragHeaderPointerDown && (
            <div
              onPointerDown={onDragHeaderPointerDown}
              aria-label={moveLabel}
              role="separator"
              className="group/handle right-sm left-sm h-sm absolute top-0 z-20 flex cursor-grab touch-none items-center justify-center select-none active:cursor-grabbing"
            >
              <span className="bg-foreground/20 group-hover/handle:bg-primary h-2xs duration-base block w-xl rounded-full transition-all group-hover/handle:w-16" />
            </div>
          )}

          <header className="px-lg pt-md border-foreground/10 shrink-0 border-b pb-0">
            {selectorRestaurants ? (
              <>
                {eyebrow && (
                  <Overline className="text-primary mb-2xs typo-overline block">
                    {eyebrow}
                  </Overline>
                )}
                <div className="gap-2xs flex items-center">
                  <Select
                    value={selectedRestaurantId}
                    onValueChange={onSelectRestaurant}
                  >
                    <SelectTrigger
                      size="sm"
                      className="text-foreground hover:text-foreground gap-xs h-auto border-0 bg-transparent px-0 py-0 transition-colors [&_[data-slot=select-value]]:text-xl [&_[data-slot=select-value]]:font-semibold [&_[data-slot=select-value]]:tracking-tight"
                    >
                      <StatusDot status={status} size="md" />
                      <SelectValue>
                        {(id: string) => selectorRestaurants.find((r) => r.id === id)?.name ?? id}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent align="start">
                      {selectorRestaurants.map((r) => (
                        <SelectItem key={r.id} value={r.id} label={r.name}>
                          <StatusDot status={r.status} size="sm" />
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="gap-3xs ml-auto flex items-center">
                    {onToggleExpand && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={onToggleExpand}
                        aria-label={expanded ? collapseLabel : expandLabel}
                      >
                        {expanded ? <MinimizeIcon size={ICON_SIZE} /> : <MaximizeIcon size={ICON_SIZE} />}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={onClose}
                      aria-label={closeLabel}
                    >
                      <XIcon size={ICON_SIZE} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="gap-2xs flex items-center">
                <StatusDot status={status} size="sm" />
                {eyebrow && <Overline>{eyebrow}</Overline>}
                <div className="gap-3xs ml-auto flex items-center">
                  {onToggleExpand && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={onToggleExpand}
                      aria-label={expanded ? collapseLabel : expandLabel}
                    >
                      {expanded ? <MinimizeIcon size={ICON_SIZE} /> : <MaximizeIcon size={ICON_SIZE} />}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onClose}
                    aria-label={closeLabel}
                  >
                    <XIcon size={ICON_SIZE} />
                  </Button>
                </div>
              </div>
            )}
            {!selectorRestaurants && (
              <H2 className="mt-xs mb-3xs text-foreground scroll-m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                {title}
              </H2>
            )}
            <Muted className="typo-body-sm mb-xs">{caption}</Muted>
            {tabSlot && (
              <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {tabSlot}
              </div>
            )}
          </header>

          <div className="gap-md p-lg @container flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0">
            {children}
          </div>
        </motion.section>
      )}
    </AnimatePresence>,
    document.body
  );
});

RestaurantSheet.displayName = "RestaurantSheet";

export { RestaurantSheet };

export type { RestaurantSheetProps, RestaurantSelectorItem };
