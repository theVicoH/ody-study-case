import { api } from "@/lib/api/api.client";

import type { ApiPaginated, ApiRestaurant, CreateRestaurantInput } from "@/types/api/api.types";

const DEFAULT_LIMIT = 100;

export const restaurantsApi = {
  list(organizationId?: string): Promise<ApiPaginated<ApiRestaurant>> {
    const params = new URLSearchParams({ limit: String(DEFAULT_LIMIT) });

    if (organizationId) params.set("organizationId", organizationId);

    return api.get<ApiPaginated<ApiRestaurant>>(`/restaurants?${params.toString()}`);
  },
  create(input: CreateRestaurantInput): Promise<ApiRestaurant> {
    return api.post<ApiRestaurant>("/restaurants", input);
  },
  delete(id: string): Promise<void> {
    return api.delete<void>(`/restaurants/${id}`);
  }
};
