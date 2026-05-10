import { apiRoutes, buildQuery } from "@workspace/shared";

import type { ApiPaginated, ApiRestaurant, CreateRestaurantInput } from "@/types/api/api.types";

import { api } from "@/lib/api/api.client";


const DEFAULT_LIMIT = 100;

export const restaurantsApi = {
  list(organizationId?: string): Promise<ApiPaginated<ApiRestaurant>> {
    return api.get<ApiPaginated<ApiRestaurant>>(`${apiRoutes.restaurants.base}${buildQuery({ limit: DEFAULT_LIMIT, organizationId })}`);
  },
  create(input: CreateRestaurantInput): Promise<ApiRestaurant> {
    return api.post<ApiRestaurant>(apiRoutes.restaurants.base, input);
  },
  delete(id: string): Promise<void> {
    return api.delete<void>(apiRoutes.restaurants.byId(id));
  }
};
