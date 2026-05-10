import { apiRoutes, buildQuery } from "@workspace/shared";

import type { ApiPaginated, ApiRestaurant, CreateRestaurantInput, UpdateRestaurantSettingsInput } from "@/types/api/api.types";

import { api } from "@/lib/api/api.client";


const DEFAULT_LIMIT = 100;

export const restaurantsApi = {
  list(organizationId?: string): Promise<ApiPaginated<ApiRestaurant>> {
    return api.get<ApiPaginated<ApiRestaurant>>(`${apiRoutes.restaurants.base}${buildQuery({ limit: DEFAULT_LIMIT, organizationId })}`);
  },
  getById(id: string): Promise<ApiRestaurant> {
    return api.get<ApiRestaurant>(apiRoutes.restaurants.byId(id));
  },
  create(input: CreateRestaurantInput): Promise<ApiRestaurant> {
    return api.post<ApiRestaurant>(apiRoutes.restaurants.base, input);
  },
  updateSettings(id: string, input: UpdateRestaurantSettingsInput): Promise<ApiRestaurant> {
    return api.patch<ApiRestaurant>(`${apiRoutes.restaurants.byId(id)}/settings`, input);
  },
  delete(id: string): Promise<void> {
    return api.delete<void>(apiRoutes.restaurants.byId(id));
  }
};
