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
const ANIM_DURATION_BODY = 0.7;
const ANIM_DURATION_HEAD = 0.6;
const ANIM_HEAD_SCALE_MIN = 0.6;
const ANIM_HEAD_SCALE_PEAK = 1.2;
const ANIM_BODY_DASHOFFSET = 50;
const ANIM_BODY_OPACITY_START = 0.3;
const ANIM_BODY_DELAY = 0.1;
const HEAD_CX = 12;
const HEAD_CY = 8;
const HEAD_R = 4;
const DASH_ARRAY_BODY = 50;

export interface UserIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface UserIconProps extends Omit<
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

const UserIcon = forwardRef<UserIconHandle, UserIconProps>((
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

  const bodyVariants: Variants = {
    normal: { strokeDashoffset: 0, opacity: 1 },
    animate: {
      strokeDashoffset: [ANIM_BODY_DASHOFFSET, 0],
      opacity: [ANIM_BODY_OPACITY_START, 1],
      transition: {
        duration: ANIM_DURATION_BODY * duration,
        ease: "easeInOut" as const,
        delay: ANIM_BODY_DELAY
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
          className="lucide lucide-user-icon lucide-user"
        >
          <m.path
            d="M19 21a7 7 0 0 0-14 0"
            strokeDasharray={DASH_ARRAY_BODY}
            strokeDashoffset={DASH_ARRAY_BODY}
            variants={bodyVariants}
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

UserIcon.displayName = "UserIcon";

export { UserIcon };
