import React from "react";

import { GRID_CONFIG } from "./grid-overlay.constants";

import type { GridOverlayProps } from "./grid-overlay.types";

const COLS = Array.from({ length: GRID_CONFIG.TOTAL_COLUMNS });

export const GridOverlay = ({ visible, leftOffset = 0 }: GridOverlayProps): React.JSX.Element | null => {
  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="pr-md pointer-events-none fixed inset-0 z-[9999]"
      style={{ paddingLeft: leftOffset > 0 ? `${leftOffset}px` : undefined }}
    >
      <div className="gap-xl grid h-full grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
        {COLS.map((_, i) => (
          <div
            key={i}
            className={
              i >= GRID_CONFIG.LG_COLUMNS_START
                ? "border-accent/30 bg-accent/10 hidden border-x lg:block"
                : i >= GRID_CONFIG.MD_COLUMNS_START
                  ? "border-accent/30 bg-accent/10 hidden border-x md:block"
                  : "border-accent/30 bg-accent/10 border-x"
            }
          />
        ))}
      </div>
    </div>
  );
};

