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
const ANIM_BASE_OPACITY = 0.65;
const ANIM_DOOR_OPACITY_MID = 0.4;
const ANIM_DURATION_FAST = 0.2;
const ANIM_DURATION_MEDIUM = 0.35;
const SVG_VIEWBOX_SIZE = 24;

export interface HouseIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface HouseIconProps extends Omit<
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

const HouseIcon = forwardRef<HouseIconHandle, HouseIconProps>((
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

  const baseVariants: Variants = {
    normal: { opacity: 1 },
    animate: {
      opacity: ANIM_BASE_OPACITY,
      transition: {
        duration: ANIM_DURATION_FAST * duration,
        ease: "easeOut"
      }
    }
  };

  const doorVariants: Variants = {
    normal: { opacity: 1 },
    animate: {
      opacity: [1, ANIM_DOOR_OPACITY_MID, 1],
      transition: {
        duration: ANIM_DURATION_MEDIUM * duration,
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
          animate={controls}
          initial="normal"
        >
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10" />
          <m.path
            d="M21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9"
            variants={baseVariants}
          />
          <m.path
            d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
            variants={doorVariants}
          />
        </m.svg>
      </m.div>
    </LazyMotion>
  );
});

HouseIcon.displayName = "HouseIcon";

export { HouseIcon };
