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
const ANIM_ROTATE_PEAK = 16;
const ANIM_SCALE_PEAK_LARGE = 1.06;
const ANIM_Y_OFFSET_ABS = 0.8;
const ANIM_Y_OFFSET = -ANIM_Y_OFFSET_ABS;
const ANIM_DURATION_SPIN = 0.9;
const ANIM_DURATION_GEAR = 0.7;
const ANIM_DELAY_GEAR = 0.06;
const ANIM_SCALE_CORE_PEAK = 1.08;
const ANIM_DURATION_CORE = 0.6;
const ANIM_DELAY_CORE = 0.26;
const ANIM_SCALE_SPARK_MIN = 0.6;
const ANIM_SCALE_SPARK_PEAK = 1.25;
const ANIM_DURATION_SPARK = 0.35;
const SPARK_CX_TOP = 12;
const SPARK_CY_TOP = 4.6;
const SPARK_R_TOP = 0.8;
const SPARK_DELAY_TOP = 0.18;
const SPARK_CX_RIGHT = 19;
const SPARK_CY_RIGHT = 8;
const SPARK_R_SMALL = 0.7;
const SPARK_DELAY_RIGHT = 0.26;
const SPARK_CX_BOTTOM_RIGHT = 18.5;
const SPARK_CY_BOTTOM_RIGHT = 16.5;
const SPARK_DELAY_BOTTOM_RIGHT = 0.34;
const SPARK_CX_BOTTOM_LEFT = 8;
const SPARK_CY_BOTTOM_LEFT = 18;
const SPARK_DELAY_BOTTOM_LEFT = 0.42;
const SPARK_CX_LEFT = 5.5;
const SPARK_CY_LEFT = 9;
const SPARK_DELAY_LEFT = 0.5;
const CIRCLE_CX = 12;
const CIRCLE_CY = 12;
const CIRCLE_R = 3;

export interface SettingsIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SettingsIconProps extends Omit<
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

const SettingsIcon = forwardRef<SettingsIconHandle, SettingsIconProps>((
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

  const groupSpin: Variants = {
    normal: { rotate: 0, scale: 1, y: 0 },
    animate: {
      rotate: [0, ANIM_ROTATE_PEAK, 0],
      scale: [1, ANIM_SCALE_PEAK_LARGE, 1],
      y: [0, ANIM_Y_OFFSET, 0],
      transition: { duration: ANIM_DURATION_SPIN * duration, ease: "easeInOut" }
    }
  };

  const gearDraw: Variants = {
    normal: { pathLength: 0, opacity: 1 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: ANIM_DURATION_GEAR * duration,
        ease: "easeInOut",
        delay: ANIM_DELAY_GEAR
      }
    }
  };

  const coreDraw: Variants = {
    normal: { pathLength: 0, scale: 1, opacity: 1 },
    animate: {
      pathLength: 1,
      scale: [1, ANIM_SCALE_CORE_PEAK, 1],
      opacity: [1, 1, 1],
      transition: {
        duration: ANIM_DURATION_CORE * duration,
        ease: "easeInOut",
        delay: ANIM_DELAY_CORE
      }
    }
  };

  const tickSpark = (delay: number): Variants => ({
    normal: { opacity: 0, scale: ANIM_SCALE_SPARK_MIN },
    animate: {
      opacity: [0, 1, 0],
      scale: [ANIM_SCALE_SPARK_MIN, ANIM_SCALE_SPARK_PEAK, 1],
      transition: { duration: ANIM_DURATION_SPARK * duration, ease: "easeOut", delay }
    }
  });

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
          className="lucide lucide-settings-icon lucide-settings"
        >
          <m.g variants={groupSpin} initial="normal" animate={controls}>
            <g>
              <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
              <circle cx={CIRCLE_CX} cy={CIRCLE_CY} r={CIRCLE_R} />
            </g>

            <m.path
              d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
              pathLength={1}
              variants={gearDraw}
              initial="normal"
              animate={controls}
            />
            <m.circle
              cx={CIRCLE_CX}
              cy={CIRCLE_CY}
              r={CIRCLE_R}
              pathLength={1}
              variants={coreDraw}
              initial="normal"
              animate={controls}
            />

            <m.circle
              cx={SPARK_CX_TOP}
              cy={SPARK_CY_TOP}
              r={SPARK_R_TOP}
              fill="currentColor"
              variants={tickSpark(SPARK_DELAY_TOP)}
              initial="normal"
              animate={controls}
            />
            <m.circle
              cx={SPARK_CX_RIGHT}
              cy={SPARK_CY_RIGHT}
              r={SPARK_R_SMALL}
              fill="currentColor"
              variants={tickSpark(SPARK_DELAY_RIGHT)}
              initial="normal"
              animate={controls}
            />
            <m.circle
              cx={SPARK_CX_BOTTOM_RIGHT}
              cy={SPARK_CY_BOTTOM_RIGHT}
              r={SPARK_R_SMALL}
              fill="currentColor"
              variants={tickSpark(SPARK_DELAY_BOTTOM_RIGHT)}
              initial="normal"
              animate={controls}
            />
            <m.circle
              cx={SPARK_CX_BOTTOM_LEFT}
              cy={SPARK_CY_BOTTOM_LEFT}
              r={SPARK_R_SMALL}
              fill="currentColor"
              variants={tickSpark(SPARK_DELAY_BOTTOM_LEFT)}
              initial="normal"
              animate={controls}
            />
            <m.circle
              cx={SPARK_CX_LEFT}
              cy={SPARK_CY_LEFT}
              r={SPARK_R_SMALL}
              fill="currentColor"
              variants={tickSpark(SPARK_DELAY_LEFT)}
              initial="normal"
              animate={controls}
            />
          </m.g>
        </m.svg>
      </m.div>
    </LazyMotion>
  );
});

SettingsIcon.displayName = "SettingsIcon";

export { SettingsIcon };
