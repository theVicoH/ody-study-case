import { apiRoutes } from "@workspace/shared";

import type { ApiRestaurantStats } from "@/types/api/api.types";

import { api } from "@/lib/api/api.client";

export const restaurantStatsApi = {
  get(restaurantId: string): Promise<ApiRestaurantStats> {
    return api.get<ApiRestaurantStats>(apiRoutes.restaurants.stats(restaurantId));
  },
  getGroup(restaurantIds: ReadonlyArray<string>): Promise<ApiRestaurantStats> {
    return api.get<ApiRestaurantStats>(apiRoutes.stats.group(restaurantIds));
  }
};
