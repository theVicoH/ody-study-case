import React, { useEffect, useRef } from "react";

import type { RestaurantTopdownSceneApi } from "@/scenes/restaurant-topdown-scene/restaurant-topdown-scene.controller";
import type { Restaurant } from "@workspace/client";

import { initRestaurantTopdownScene } from "@/scenes/restaurant-topdown-scene/restaurant-topdown-scene.controller";

interface RestaurantTopdownSceneProps {
  restaurants: ReadonlyArray<Restaurant>;
  className?: string;
}

export const RestaurantTopdownScene = ({ restaurants, className }: RestaurantTopdownSceneProps): React.JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<RestaurantTopdownSceneApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const api = initRestaurantTopdownScene(containerRef.current, restaurants);

    apiRef.current = api;

    return () => {
      api.dispose();
      apiRef.current = null;
    };
  }, [restaurants]);

  return <div ref={containerRef} className={className} />;
};
