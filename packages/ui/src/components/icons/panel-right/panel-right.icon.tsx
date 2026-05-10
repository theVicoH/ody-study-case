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
const ANIM_DURATION_FRAME = 0.6;
const ANIM_DURATION_DIVIDER = 0.5;
const ANIM_FRAME_DASHOFFSET = 80;
const ANIM_DIVIDER_DASHOFFSET = 20;
const ANIM_DIVIDER_DELAY = 0.3;
const DASH_ARRAY_FRAME = 80;
const DASH_ARRAY_DIVIDER = 20;

export interface PanelRightIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface PanelRightIconProps extends Omit<
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

const PanelRightIcon = forwardRef<PanelRightIconHandle, PanelRightIconProps>((
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

  const frameVariants: Variants = {
    normal: { strokeDashoffset: 0, opacity: 1 },
    animate: {
      strokeDashoffset: [ANIM_FRAME_DASHOFFSET, 0],
      opacity: 1,
      transition: {
        duration: ANIM_DURATION_FRAME * duration,
        ease: "easeInOut" as const
      }
    }
  };

  const dividerVariants: Variants = {
    normal: { strokeDashoffset: 0, opacity: 1 },
    animate: {
      strokeDashoffset: [ANIM_DIVIDER_DASHOFFSET, 0],
      opacity: [0, 1],
      transition: {
        duration: ANIM_DURATION_DIVIDER * duration,
        ease: "easeInOut" as const,
        delay: ANIM_DIVIDER_DELAY
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
          className="lucide lucide-panel-right-icon lucide-panel-right"
        >
          <m.rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            strokeDasharray={DASH_ARRAY_FRAME}
            strokeDashoffset={DASH_ARRAY_FRAME}
            variants={frameVariants}
            initial="normal"
            animate={controls}
          />
          <m.line
            x1="15"
            y1="3"
            x2="15"
            y2="21"
            strokeDasharray={DASH_ARRAY_DIVIDER}
            strokeDashoffset={DASH_ARRAY_DIVIDER}
            variants={dividerVariants}
            initial="normal"
            animate={controls}
          />
        </m.svg>
      </m.div>
    </LazyMotion>
  );
});

PanelRightIcon.displayName = "PanelRightIcon";

export { PanelRightIcon };
