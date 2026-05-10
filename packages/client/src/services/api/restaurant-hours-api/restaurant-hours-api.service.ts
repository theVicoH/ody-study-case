import { apiRoutes } from "@workspace/shared";

import type { ApiOpeningHour } from "@/types/api/api.types";

import { api } from "@/lib/api/api.client";


interface OpeningHoursResponse {
  data: ApiOpeningHour[];
}

export const restaurantHoursApi = {
  list(restaurantId: string): Promise<OpeningHoursResponse> {
    return api.get<OpeningHoursResponse>(apiRoutes.restaurants.openingHours(restaurantId));
  },
  upsert(restaurantId: string, hours: ReadonlyArray<ApiOpeningHour>): Promise<OpeningHoursResponse> {
    return api.put<OpeningHoursResponse>(apiRoutes.restaurants.openingHours(restaurantId), { hours });
  }
};
