import React, { useEffect, useImperativeHandle, useRef } from "react";

import type {
  RestaurantSceneApi,
  RestaurantSceneCallbacks
} from "@/scenes/restaurant-scene/restaurant-scene.types";
import type { Restaurant, RestaurantStats } from "@workspace/client";

import { initRestaurantScene } from "@/scenes/restaurant-scene/restaurant-scene.controller";

interface SunLabels {
  brand: string;
  cta: string;
}

interface RestaurantSceneProps extends RestaurantSceneCallbacks {
  restaurants: ReadonlyArray<Restaurant>;
  computeStats: (restaurant: Restaurant) => RestaurantStats;
  sunLabels: SunLabels;
  className?: string;
  apiRef?: React.MutableRefObject<RestaurantSceneApi | null>;
}

export const RestaurantScene = ({
  restaurants,
  computeStats,
  sunLabels,
  className,
  apiRef,
  onSelectGroup,
  onSelectRestaurant,
  onEmptyClick
}: RestaurantSceneProps): React.JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const localApiRef = useRef<RestaurantSceneApi | null>(null);

  useImperativeHandle(apiRef, () => localApiRef.current as RestaurantSceneApi);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const api = initRestaurantScene({
      container: containerRef.current,
      restaurants,
      computeStats,
      sunLabels,
      callbacks: { onSelectGroup, onSelectRestaurant, onEmptyClick }
    });

    localApiRef.current = api;

    if (apiRef) apiRef.current = api;

    return () => {
      api.dispose();
      localApiRef.current = null;
      if (apiRef) apiRef.current = null;
    };
  }, [restaurants, computeStats, sunLabels, onSelectGroup, onSelectRestaurant, onEmptyClick, apiRef]);

  return <div ref={containerRef} className={className} />;
};
