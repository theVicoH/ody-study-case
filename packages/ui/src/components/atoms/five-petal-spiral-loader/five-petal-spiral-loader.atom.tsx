import React, { useEffect, useRef } from "react";

import { cn } from "@workspace/ui/lib/utils";

const SVG_NS = "http://www.w3.org/2000/svg";

const SPIRAL_CONFIG = {
  particleCount: 85,
  trailSpan: 0.34,
  durationMs: 4600,
  rotationDurationMs: 28000,
  pulseDurationMs: 4200,
  strokeWidth: 4.4,
  spiralR: 5,
  spiralr: 1,
  spirald: 3,
  spiralScale: 2.2,
  spiralBreath: 0.45,
  pathSteps: 480,
  detailScaleBase: 0.52,
  detailScaleAmp: 0.48,
  detailScalePhase: 0.55,
  detailDOffset: 0.25,
  particleRadiusBase: 0.9,
  particleRadiusAmp: 2.7,
  particleOpacityBase: 0.04,
  particleOpacityAmp: 0.96,
  fadeExp: 0.56,
  pathOpacity: 0.1,
  centerXY: 50,
  fullCircle: 360
} as const;

function normalizeProgress(progress: number): number {
  return ((progress % 1) + 1) % 1;
}

function getDetailScale(time: number): number {
  const pulseProgress = (time % SPIRAL_CONFIG.pulseDurationMs) / SPIRAL_CONFIG.pulseDurationMs;
  const pulseAngle = pulseProgress * Math.PI * 2;

  return (
    SPIRAL_CONFIG.detailScaleBase +
    ((Math.sin(pulseAngle + SPIRAL_CONFIG.detailScalePhase) + 1) / 2) * SPIRAL_CONFIG.detailScaleAmp
  );
}

function getRotation(time: number): number {
  return -((time % SPIRAL_CONFIG.rotationDurationMs) / SPIRAL_CONFIG.rotationDurationMs) * SPIRAL_CONFIG.fullCircle;
}

function computePoint(
  progress: number,
  detailScale: number
): { x: number; y: number } {
  const t = progress * Math.PI * 2;
  const d = SPIRAL_CONFIG.spirald + detailScale * SPIRAL_CONFIG.detailDOffset;
  const rDiff = SPIRAL_CONFIG.spiralR - SPIRAL_CONFIG.spiralr;
  const baseX = rDiff * Math.cos(t) + d * Math.cos((rDiff / SPIRAL_CONFIG.spiralr) * t);
  const baseY = rDiff * Math.sin(t) - d * Math.sin((rDiff / SPIRAL_CONFIG.spiralr) * t);
  const scale = SPIRAL_CONFIG.spiralScale + detailScale * SPIRAL_CONFIG.spiralBreath;

  return {
    x: SPIRAL_CONFIG.centerXY + baseX * scale,
    y: SPIRAL_CONFIG.centerXY + baseY * scale
  };
}

function buildPath(detailScale: number): string {
  return Array.from({ length: SPIRAL_CONFIG.pathSteps + 1 }, (_, index) => {
    const pt = computePoint(index / SPIRAL_CONFIG.pathSteps, detailScale);

    return `${index === 0 ? "M" : "L"} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
  }).join(" ");
}

function getParticleProps(
  index: number,
  progress: number,
  detailScale: number
): { x: number; y: number; radius: number; opacity: number } {
  const tailOffset = index / (SPIRAL_CONFIG.particleCount - 1);
  const pt = computePoint(
    normalizeProgress(progress - tailOffset * SPIRAL_CONFIG.trailSpan),
    detailScale
  );
  const fade = Math.pow(1 - tailOffset, SPIRAL_CONFIG.fadeExp);

  return {
    x: pt.x,
    y: pt.y,
    radius: SPIRAL_CONFIG.particleRadiusBase + fade * SPIRAL_CONFIG.particleRadiusAmp,
    opacity: SPIRAL_CONFIG.particleOpacityBase + fade * SPIRAL_CONFIG.particleOpacityAmp
  };
}

interface FivePetalSpiralLoaderProps {
  className?: string;
  size?: number;
  ariaLabel?: string;
}

const DEFAULT_SIZE = 96;

const FivePetalSpiralLoader = ({
  className,
  size = DEFAULT_SIZE,
  ariaLabel = "Loading"
}: FivePetalSpiralLoaderProps): React.ReactElement => {
  const groupRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const group = groupRef.current;
    const path = pathRef.current;

    if (!group || !path) return;

    path.setAttribute("stroke-width", String(SPIRAL_CONFIG.strokeWidth));

    const circles: SVGCircleElement[] = Array.from(
      { length: SPIRAL_CONFIG.particleCount },
      () => {
        const circle = document.createElementNS(SVG_NS, "circle");

        circle.setAttribute("fill", "currentColor");
        group.appendChild(circle);

        return circle;
      }
    );

    const render = (now: number): void => {
      if (startRef.current === null) startRef.current = now;
      const time = now - startRef.current;
      const progress = (time % SPIRAL_CONFIG.durationMs) / SPIRAL_CONFIG.durationMs;
      const detailScale = getDetailScale(time);

      group.setAttribute(
        "transform",
        `rotate(${getRotation(time)} ${SPIRAL_CONFIG.centerXY} ${SPIRAL_CONFIG.centerXY})`
      );
      path.setAttribute("d", buildPath(detailScale));

      circles.forEach((circle, index) => {
        const particle = getParticleProps(index, progress, detailScale);

        circle.setAttribute("cx", particle.x.toFixed(2));
        circle.setAttribute("cy", particle.y.toFixed(2));
        circle.setAttribute("r", particle.radius.toFixed(2));
        circle.setAttribute("opacity", particle.opacity.toFixed(3));
      });

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      circles.forEach((circle) => group.removeChild(circle));
      startRef.current = null;
    };
  }, []);

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={cn("text-primary dark:text-foreground", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <g ref={groupRef}>
          <path
            ref={pathRef}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={SPIRAL_CONFIG.pathOpacity}
          />
        </g>
      </svg>
    </div>
  );
};

export { FivePetalSpiralLoader };
