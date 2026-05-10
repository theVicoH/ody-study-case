import React from "react";
import type { CSSProperties } from "react";

import { AnimatePresence, motion } from "motion/react";


import type { DashboardLayoutProps } from "./dashboard-layout.types";

const BRAND_FADE_OFFSET = 8;
const BRAND_TRANSITION_DURATION = 0.25;
const BRAND_TRANSITION = {
  duration: BRAND_TRANSITION_DURATION,
  ease: "easeInOut"
} as const;

const resolveRight = (value: string | number): string =>
  typeof value === "number" ? `${value}px` : value;

const buildHeaderStyle = (headerActionsRight: string | number | undefined): CSSProperties | undefined =>
  headerActionsRight === undefined
    ? undefined
    : { right: resolveRight(headerActionsRight) };

export const DashboardLayout = ({
  brand,
  brandVisible = true,
  headerActions,
  headerActionsRight,
  background,
  backgroundDimmed = false,
  footer,
  footerVisible = true,
  children
}: DashboardLayoutProps): React.JSX.Element => {
  const headerActionsStyle = buildHeaderStyle(headerActionsRight);

  return (
    <div className="bg-background text-foreground bg-ambient-glow fixed inset-0 overflow-hidden">
      {brand ? (
        <AnimatePresence>
          {brandVisible ? (
            <motion.header
              className="top-md left-md gap-xs absolute z-40 flex items-center"
              initial={{ opacity: 0, y: -BRAND_FADE_OFFSET }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -BRAND_FADE_OFFSET }}
              transition={BRAND_TRANSITION}
            >
              {brand}
            </motion.header>
          ) : null}
        </AnimatePresence>
      ) : null}

      {headerActions ? (
        <div
          className="top-md right-md gap-xs ease-emphasized duration-base absolute z-40 flex items-center transition-[right]"
          style={headerActionsStyle}
        >
          {headerActions}
        </div>
      ) : null}

      {background ? (
        <div
          className={[
            "absolute inset-0 z-0 transition-opacity duration-base ease-in-out",
            backgroundDimmed ? "pointer-events-none opacity-0" : "opacity-100"
          ].join(" ")}
          aria-hidden={backgroundDimmed ? "true" : undefined}
        >
          {background}
        </div>
      ) : null}

      {footer && footerVisible ? (
        <div className="bottom-md absolute left-1/2 z-20 -translate-x-1/2">
          {footer}
        </div>
      ) : null}

      {children}
    </div>
  );
};
