"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type HTMLAttributes
} from "react";

import {
  domMin,
  LazyMotion,
  m,
  useAnimation,
  useReducedMotion
} from "motion/react";

import type { Variants } from "motion/react";

import { cn } from "@/lib/utils";


const ICON_DEFAULT_SIZE = 24;
const ICON_DEFAULT_DURATION = 0.6;
const SVG_VIEWBOX_SIZE = 24;
const ROTATE_SWING_DEG = 6;
const ROTATE_SETTLE_DEG = 3;

export interface CalendarIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CalendarIconProps
  extends Omit<
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

const CalendarIcon = forwardRef<CalendarIconHandle, CalendarIconProps>((
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
  const controls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
    isControlled.current = true;

    return {
      startAnimation: () => (reduced ? controls.start("normal") : controls.start("animate")),
      stopAnimation: () => controls.start("normal")
    };
  });

  const handleEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isAnimated || reduced) return;
      if (!isControlled.current) controls.start("animate");
      else onMouseEnter?.(event);
    },
    [controls, reduced, isAnimated, onMouseEnter]
  );

  const handleLeave = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlled.current) controls.start("normal");
      else onMouseLeave?.(event);
    },
    [controls, onMouseLeave]
  );

  const bodyVariants: Variants = {
    normal: { rotate: 0, y: 0 },
    animate: {
      rotate: [0, -ROTATE_SWING_DEG, ROTATE_SWING_DEG, -ROTATE_SETTLE_DEG, 0],
      y: [0, -1, 0],
      transition: { duration, ease: "easeInOut" }
    }
  };

  const dotVariants: Variants = {
    normal: { scale: 1, opacity: 1 },
    animate: {
      scale: [1, 1.4, 1],
      opacity: [1, 0.6, 1],
      transition: { duration, ease: "easeInOut", times: [0, 0.5, 1] }
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
          animate={controls}
          initial="normal"
          variants={bodyVariants}
        >
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <m.circle cx="8" cy="14" r="1" fill="currentColor" stroke="none" variants={dotVariants} />
          <m.circle cx="12" cy="14" r="1" fill="currentColor" stroke="none" variants={dotVariants} />
          <m.circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" variants={dotVariants} />
        </m.svg>
      </m.div>
    </LazyMotion>
  );
});

CalendarIcon.displayName = "CalendarIcon";

export { CalendarIcon };
