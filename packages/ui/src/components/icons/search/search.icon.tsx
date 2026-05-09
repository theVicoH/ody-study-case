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
const ANIM_DURATION_LENS = 1.2;
const LENS_CX = 11;
const LENS_CY = 11;
const LENS_R = 8;
const LENS_X_OFFSET_1 = 2;
const LENS_X_OFFSET_2_ABS = 2;
const LENS_X_OFFSET_2 = -LENS_X_OFFSET_2_ABS;
const LENS_X_OFFSET_3 = 1;
const LENS_Y_OFFSET_1_ABS = 1;
const LENS_Y_OFFSET_1 = -LENS_Y_OFFSET_1_ABS;
const LENS_Y_OFFSET_2 = 2;
const LENS_ROTATE_1 = 6;
const LENS_ROTATE_2_ABS = 6;
const LENS_ROTATE_2 = -LENS_ROTATE_2_ABS;
const LENS_ROTATE_3 = 4;

export interface SearchIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SearchIconProps extends Omit<
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

const SearchIcon = forwardRef<SearchIconHandle, SearchIconProps>((
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
    (e?: React.MouseEvent<HTMLDivElement>) => {
      if (!isControlled.current) controls.start("normal");
      else if (e) onMouseLeave?.(e);
    },
    [controls, onMouseLeave]
  );

  const lensVariants: Variants = {
    normal: { x: 0, y: 0, rotate: 0, opacity: 1 },
    animate: {
      x: [0, LENS_X_OFFSET_1, LENS_X_OFFSET_2, LENS_X_OFFSET_3, 0],
      y: [0, LENS_Y_OFFSET_1, LENS_Y_OFFSET_2, LENS_Y_OFFSET_1, 0],
      rotate: [0, LENS_ROTATE_1, LENS_ROTATE_2, LENS_ROTATE_3, 0],
      transition: {
        duration: ANIM_DURATION_LENS * duration,
        ease: "easeInOut" as const
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
          animate={controls}
          initial="normal"
        >
          <m.g variants={lensVariants}>
            <m.circle cx={LENS_CX} cy={LENS_CY} r={LENS_R} />
            <path d="m21 21-4.34-4.34" />
          </m.g>
        </m.svg>
      </m.div>
    </LazyMotion>
  );
});

SearchIcon.displayName = "SearchIcon";

export { SearchIcon };
