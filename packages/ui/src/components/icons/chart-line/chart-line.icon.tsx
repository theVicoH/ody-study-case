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
const ANIM_DURATION_FAST = 0.2;
const ANIM_DURATION_PATH = 0.6;
const ANIM_DURATION_CHART = 0.4;
const ANIM_PATH_OPACITY_START = 0.7;
const ANIM_CHART_SCALE_PEAK = 1.05;

export interface ChartLineIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ChartLineIconProps extends Omit<
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

const ChartLineIcon = forwardRef<ChartLineIconHandle, ChartLineIconProps>((
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
      startAnimation: () =>
        reduced ? controls.start("normal") : controls.start("animate"),
      stopAnimation: () => controls.start("normal")
    };
  });

  const handleEnter = useCallback(
    (e?: React.MouseEvent<HTMLDivElement>) => {
      if (!isAnimated || reduced) return;
      if (!isControlled.current) controls.start("animate");
      else if (e) onMouseEnter?.(e);
    },
    [controls, reduced, isAnimated, onMouseEnter]
  );

  const handleLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlled.current) {
        controls.start("normal");
      } else {
        if (e) onMouseLeave?.(e);
      }
    },
    [controls, onMouseLeave]
  );

  const pathVariants: Variants = {
    normal: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: ANIM_DURATION_FAST * duration }
    },
    animate: {
      pathLength: [0, 1],
      opacity: [ANIM_PATH_OPACITY_START, 1],
      transition: {
        duration: ANIM_DURATION_PATH * duration,
        ease: "easeInOut"
      }
    }
  };

  const chartVariants: Variants = {
    normal: {
      scale: 1,
      transition: { duration: ANIM_DURATION_FAST * duration }
    },
    animate: {
      scale: [1, ANIM_CHART_SCALE_PEAK, 1],
      transition: {
        duration: ANIM_DURATION_CHART * duration,
        ease: "easeInOut"
      }
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
          variants={chartVariants}
          animate={controls}
          initial="normal"
        >
          <m.path d="M3 3v16a2 2 0 0 0 2 2h16" variants={pathVariants} />
          <m.path d="m19 9-5 5-4-4-3 3" variants={pathVariants} />
        </m.svg>
      </m.div>
    </LazyMotion>
  );
});

ChartLineIcon.displayName = "ChartLineIcon";

export { ChartLineIcon };
