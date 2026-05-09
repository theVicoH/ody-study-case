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
const ANIM_DURATION_ARC = 0.7;
const ANIM_DURATION_HEAD = 0.6;
const ANIM_ARC_DASHOFFSET = 50;
const ANIM_ARC_OPACITY_START = 0.3;
const ANIM_HEAD_SCALE_MIN = 0.6;
const ANIM_HEAD_SCALE_PEAK = 1.2;
const ANIM_SIDE_ARC_DASHOFFSET = 40;
const ANIM_SIDE_ARC_OPACITY_START = 0.2;
const ANIM_SIDE_ARC_OPACITY_NORMAL = 0.8;
const ANIM_SIDE_ARC_DELAY = 0.3;
const HEAD_CX = 9;
const HEAD_CY = 7;
const HEAD_R = 4;
const DASH_ARRAY_ARC = 50;
const DASH_ARRAY_SIDE = 40;

export interface UsersIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface UsersIconProps extends Omit<
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

const UsersIcon = forwardRef<UsersIconHandle, UsersIconProps>((
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

  const arcVariants: Variants = {
    normal: { strokeDashoffset: 0, opacity: 1 },
    animate: {
      strokeDashoffset: [ANIM_ARC_DASHOFFSET, 0],
      opacity: [ANIM_ARC_OPACITY_START, 1],
      transition: {
        duration: ANIM_DURATION_ARC * duration,
        ease: "easeInOut" as const
      }
    }
  };

  const headVariants: Variants = {
    normal: { scale: 1, opacity: 1 },
    animate: {
      scale: [ANIM_HEAD_SCALE_MIN, ANIM_HEAD_SCALE_PEAK, 1],
      opacity: [0, 1],
      transition: {
        duration: ANIM_DURATION_HEAD * duration,
        ease: "easeOut" as const
      }
    }
  };

  const sideArcVariants: Variants = {
    normal: { strokeDashoffset: 0, opacity: ANIM_SIDE_ARC_OPACITY_NORMAL },
    animate: {
      strokeDashoffset: [ANIM_SIDE_ARC_DASHOFFSET, 0],
      opacity: [ANIM_SIDE_ARC_OPACITY_START, 1],
      transition: {
        duration: ANIM_DURATION_ARC * duration,
        ease: "easeInOut" as const,
        delay: ANIM_SIDE_ARC_DELAY
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
          className="lucide lucide-users-icon lucide-users"
        >
          <m.path
            d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
            strokeDasharray={DASH_ARRAY_ARC}
            strokeDashoffset={DASH_ARRAY_ARC}
            variants={arcVariants}
            initial="normal"
            animate={controls}
          />
          <m.path
            d="M16 3.128a4 4 0 0 1 0 7.744"
            strokeDasharray={DASH_ARRAY_SIDE}
            strokeDashoffset={DASH_ARRAY_SIDE}
            variants={sideArcVariants}
            initial="normal"
            animate={controls}
          />
          <m.path
            d="M22 21v-2a4 4 0 0 0-3-3.87"
            strokeDasharray={DASH_ARRAY_SIDE}
            strokeDashoffset={DASH_ARRAY_SIDE}
            variants={sideArcVariants}
            initial="normal"
            animate={controls}
          />
          <m.circle
            cx={HEAD_CX}
            cy={HEAD_CY}
            r={HEAD_R}
            variants={headVariants}
            initial="normal"
            animate={controls}
          />
        </m.svg>
      </m.div>
    </LazyMotion>
  );
});

UsersIcon.displayName = "UsersIcon";

export { UsersIcon };
