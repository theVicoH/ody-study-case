import React, { useEffect, useRef } from "react";

import type { RestaurantModelPreviewApi } from "@/scenes/restaurant-model-preview/restaurant-model-preview.controller";

import { initRestaurantModelPreview } from "@/scenes/restaurant-model-preview/restaurant-model-preview.controller";

interface RestaurantModelPreviewProps {
  modelUrl: string;
  className?: string;
}

export const RestaurantModelPreview = ({ modelUrl, className }: RestaurantModelPreviewProps): React.JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<RestaurantModelPreviewApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const api = initRestaurantModelPreview(containerRef.current, modelUrl);

    apiRef.current = api;

    return () => {
      api.dispose();
      apiRef.current = null;
    };
  }, [modelUrl]);

  return <div ref={containerRef} className={className} />;
};
