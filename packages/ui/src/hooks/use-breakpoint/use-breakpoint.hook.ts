import * as React from "react";

const MOBILE_MAX = 767;
const TABLET_MAX = 1023;

const BREAKPOINT = {
  MOBILE: "mobile",
  TABLET: "tablet",
  DESKTOP: "desktop"
} as const;

type Breakpoint = typeof BREAKPOINT[keyof typeof BREAKPOINT];

interface BreakpointState {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isMobileOrTablet: boolean;
}

const resolveBreakpoint = (width: number): Breakpoint => {
  if (width <= MOBILE_MAX) return BREAKPOINT.MOBILE;
  if (width <= TABLET_MAX) return BREAKPOINT.TABLET;

  return BREAKPOINT.DESKTOP;
};

const buildState = (breakpoint: Breakpoint): BreakpointState => ({
  breakpoint,
  isMobile: breakpoint === BREAKPOINT.MOBILE,
  isTablet: breakpoint === BREAKPOINT.TABLET,
  isDesktop: breakpoint === BREAKPOINT.DESKTOP,
  isMobileOrTablet: breakpoint !== BREAKPOINT.DESKTOP
});

export function useBreakpoint(): BreakpointState {
  const [state, setState] = React.useState<BreakpointState>(() =>
    buildState(typeof window === "undefined" ? BREAKPOINT.DESKTOP : resolveBreakpoint(window.innerWidth))
  );

  React.useEffect(() => {
    const onResize = (): void => {
      setState(buildState(resolveBreakpoint(window.innerWidth)));
    };

    window.addEventListener("resize", onResize);
    onResize();

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return state;
}

export { BREAKPOINT };
export type { Breakpoint, BreakpointState };
