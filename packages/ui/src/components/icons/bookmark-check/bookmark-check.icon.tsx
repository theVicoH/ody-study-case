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
const ANIM_BOOKMARK_Y_OFFSET_ABS = 4;
const ANIM_BOOKMARK_Y_OFFSET = -ANIM_BOOKMARK_Y_OFFSET_ABS;
const ANIM_BOOKMARK_SCALE_Y_PEAK = 1.1;
const ANIM_BOOKMARK_SCALE_Y_DIP = 0.95;
const ANIM_BOOKMARK_SCALE_X_DIP = 0.97;
const ANIM_BOOKMARK_SCALE_X_PEAK = 1.02;
const ANIM_DURATION_BOOKMARK = 0.45;
const ANIM_DURATION_CHECK = 0.8;

export interface BookmarkCheckIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BookmarkCheckIconProps extends Omit<
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

const BookmarkCheckIcon = forwardRef<
 BookmarkCheckIconHandle,
 BookmarkCheckIconProps
>((
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

  const bookmarkVariants: Variants = {
    normal: {
      y: 0,
      scaleX: 1,
      scaleY: 1
    },
    animate: {
      y: [0, ANIM_BOOKMARK_Y_OFFSET, 0],
      scaleY: [1, ANIM_BOOKMARK_SCALE_Y_PEAK, ANIM_BOOKMARK_SCALE_Y_DIP, 1],
      scaleX: [1, ANIM_BOOKMARK_SCALE_X_DIP, ANIM_BOOKMARK_SCALE_X_PEAK, 1],
      transition: {
        duration: ANIM_DURATION_BOOKMARK * duration,
        ease: "easeOut"
      }
    }
  };

  const checkVariants: Variants = {
    normal: { pathLength: 1, opacity: 1 },
    animate: {
      pathLength: [0, 1],
      opacity: 1,
      transition: { duration: ANIM_DURATION_CHECK * duration, ease: "easeInOut" }
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
          variants={bookmarkVariants}
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
          <m.path d="m9 10 2 2 4-4" variants={checkVariants} />
        </m.svg>
      </m.div>
    </LazyMotion>
  );
});

BookmarkCheckIcon.displayName = "BookmarkCheckIcon";

export { BookmarkCheckIcon };
