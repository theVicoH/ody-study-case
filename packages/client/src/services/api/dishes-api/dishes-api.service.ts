import { api } from "@/lib/api/api.client";

import type {
  ApiDish,
  ApiPaginated,
  CreateDishInput,
  UpdateDishInput
} from "@/types/api/api.types";

const buildQuery = (page?: number, limit?: number): string => {
  const params = new URLSearchParams();

  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  const qs = params.toString();

  return qs ? `?${qs}` : "";
};

export const dishesApi = {
  list(restaurantId: string, page?: number, limit?: number): Promise<ApiPaginated<ApiDish>> {
    return api.get<ApiPaginated<ApiDish>>(`/restaurants/${restaurantId}/dishes${buildQuery(page, limit)}`);
  },
  create(restaurantId: string, input: CreateDishInput): Promise<ApiDish> {
    return api.post<ApiDish>(`/restaurants/${restaurantId}/dishes`, input);
  },
  update(restaurantId: string, id: string, input: UpdateDishInput): Promise<ApiDish> {
    return api.patch<ApiDish>(`/restaurants/${restaurantId}/dishes/${id}`, input);
  },
  delete(restaurantId: string, id: string): Promise<void> {
    return api.delete<void>(`/restaurants/${restaurantId}/dishes/${id}`);
  }
};
