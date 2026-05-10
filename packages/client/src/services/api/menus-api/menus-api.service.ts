import { api } from "@/lib/api/api.client";

import type {
  ApiMenu,
  ApiPaginated,
  CreateMenuInput,
  UpdateMenuInput
} from "@/types/api/api.types";

const buildQuery = (page?: number, limit?: number): string => {
  const params = new URLSearchParams();

  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  const qs = params.toString();

  return qs ? `?${qs}` : "";
};

export const menusApi = {
  list(restaurantId: string, page?: number, limit?: number): Promise<ApiPaginated<ApiMenu>> {
    return api.get<ApiPaginated<ApiMenu>>(`/restaurants/${restaurantId}/menus${buildQuery(page, limit)}`);
  },
  create(restaurantId: string, input: CreateMenuInput): Promise<ApiMenu> {
    return api.post<ApiMenu>(`/restaurants/${restaurantId}/menus`, input);
  },
  update(restaurantId: string, id: string, input: UpdateMenuInput): Promise<ApiMenu> {
    return api.patch<ApiMenu>(`/restaurants/${restaurantId}/menus/${id}`, input);
  },
  delete(restaurantId: string, id: string): Promise<void> {
    return api.delete<void>(`/restaurants/${restaurantId}/menus/${id}`);
  }
};
