"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type HTMLAttributes
} from "react";

import {
  LazyMotion,
  domMin,
  m,
  useAnimation,
  useReducedMotion
} from "motion/react";

import type { Variants } from "motion/react";

import { cn } from "@/lib/utils";

const ICON_DEFAULT_SIZE = 24;
const ICON_DEFAULT_DURATION = 1;
const SVG_VIEWBOX_SIZE = 24;
const BIN_LIFT_OFFSET = 1.5;
const LID_ROTATE = 15;
const BIN_DURATION_FACTOR = 0.8;
const LID_DURATION_FACTOR = 0.7;
const BAR_DURATION_FACTOR = 0.6;

export interface TrashIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface TrashIconProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | "color"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  size?: number;
  duration?: number;
  isAnimated?: boolean;
  color?: string;
}

const TrashIcon = forwardRef<TrashIconHandle, TrashIconProps>((
  {
    onMouseEnter,
    onMouseLeave,
    className,
    size = ICON_DEFAULT_SIZE,
    duration = ICON_DEFAULT_DURATION,
    isAnimated = true,
    color,
    ...props
  },
  ref
) => {
  const binControls = useAnimation();
  const lidControls = useAnimation();
  const barControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
    isControlled.current = true;

    return {
      startAnimation: () => {
        if (reduced) {
          binControls.start("normal");
          lidControls.start("normal");
          barControls.start("normal");
        } else {
          binControls.start("animate");
          lidControls.start("animate");
          barControls.start("animate");
        }
      },
      stopAnimation: () => {
        binControls.start("normal");
        lidControls.start("normal");
        barControls.start("normal");
      }
    };
  });

  const handleEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isAnimated || reduced) return;
      if (!isControlled.current) {
        binControls.start("animate");
        lidControls.start("animate");
        barControls.start("animate");
      } else if (e) onMouseEnter?.(e);
    },
    [binControls, lidControls, barControls, reduced, isAnimated, onMouseEnter]
  );

  const handleLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlled.current) {
        binControls.start("normal");
        lidControls.start("normal");
        barControls.start("normal");
      } else onMouseLeave?.(e);
    },
    [binControls, lidControls, barControls, onMouseLeave]
  );

  const binVariants: Variants = {
    normal: { scale: 1, rotate: 0, y: 0 },
    animate: {
      scale: [1, 1.05, 0.97, 1],
      rotate: [0, -2, 2, 0],
      y: [0, -BIN_LIFT_OFFSET, 0],
      transition: { duration: BIN_DURATION_FACTOR * duration, ease: "easeInOut" }
    }
  };

  const lidVariants: Variants = {
    normal: { rotate: 0, y: 0, transformOrigin: "12px 4px" },
    animate: {
      rotate: [-LID_ROTATE, 5, 0],
      y: [-2, 0],
      transition: { duration: LID_DURATION_FACTOR * duration, ease: "easeOut", delay: 0.1 }
    }
  };

  const barVariants: Variants = {
    normal: { scaleY: 1, opacity: 1, transformOrigin: "center bottom" },
    animate: {
      scaleY: [1, 1.2, 1],
      opacity: [1, 0.9, 1],
      transition: { duration: BAR_DURATION_FACTOR * duration, ease: "easeInOut", delay: 0.2 }
    }
  };

  return (
    <LazyMotion features={domMin} strict>
      <m.div
        className={cn("inline-flex items-center justify-center", className)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        {...props}
        style={{ color, ...props.style }}
      >
        <m.svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox={`0 0 ${SVG_VIEWBOX_SIZE} ${SVG_VIEWBOX_SIZE}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <m.path d="M10 11v6" animate={barControls} initial="normal" variants={barVariants} />
          <m.path d="M14 11v6" animate={barControls} initial="normal" variants={barVariants} />
          <m.path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
            animate={binControls}
            initial="normal"
            variants={binVariants}
          />
          <m.path d="M3 6h18" />
          <m.path
            d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            animate={lidControls}
            initial="normal"
            variants={lidVariants}
          />
        </m.svg>
      </m.div>
    </LazyMotion>
  );
});

TrashIcon.displayName = "TrashIcon";

export { TrashIcon };
