import React, { useEffect, useRef } from "react";

import type { RestaurantMiniSceneApi } from "@/scenes/restaurant-mini-scene/restaurant-mini-scene.controller";
import type { Restaurant } from "@workspace/client";

import { initRestaurantMiniScene } from "@/scenes/restaurant-mini-scene/restaurant-mini-scene.controller";

interface RestaurantMiniSceneProps {
  restaurant: Restaurant | null;
  className?: string;
}

export const RestaurantMiniScene = ({ restaurant, className }: RestaurantMiniSceneProps): React.JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<RestaurantMiniSceneApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const api = initRestaurantMiniScene(containerRef.current);

    apiRef.current = api;

    return () => {
      api.dispose();
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    apiRef.current?.setRestaurant(restaurant);
  }, [restaurant]);

  return <div ref={containerRef} className={className} />;
};
