export const MOTION_DURATION = {
  instant: 0,
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  slower: 0.6
} as const;

export const MOTION_EASE = {
  linear: [0, 0, 1, 1],
  in: [0.4, 0, 1, 1],
  out: [0, 0, 0.2, 1],
  inOut: [0.4, 0, 0.2, 1],
  emphasized: [0.2, 0, 0, 1],
  bounce: [0.34, 1.56, 0.64, 1]
} as const;

export const MOTION_SPRING = {
  soft: { type: "spring", stiffness: 120, damping: 18 },
  default: { type: "spring", stiffness: 200, damping: 22 },
  snappy: { type: "spring", stiffness: 350, damping: 28 }
} as const;

export type MotionDurationToken = keyof typeof MOTION_DURATION;

export type MotionEaseToken = keyof typeof MOTION_EASE;

export type MotionSpringToken = keyof typeof MOTION_SPRING;
