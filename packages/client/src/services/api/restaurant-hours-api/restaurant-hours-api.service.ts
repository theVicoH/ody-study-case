import { api } from "@/lib/api/api.client";

import type { ApiOpeningHour } from "@/types/api/api.types";

interface OpeningHoursResponse {
  data: ApiOpeningHour[];
}

export const restaurantHoursApi = {
  list(restaurantId: string): Promise<OpeningHoursResponse> {
    return api.get<OpeningHoursResponse>(`/restaurants/${restaurantId}/opening-hours`);
  },
  upsert(restaurantId: string, hours: ReadonlyArray<ApiOpeningHour>): Promise<OpeningHoursResponse> {
    return api.put<OpeningHoursResponse>(`/restaurants/${restaurantId}/opening-hours`, { hours });
  }
};
