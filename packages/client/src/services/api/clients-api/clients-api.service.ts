import { api } from "@/lib/api/api.client";

import type {
  ApiClient,
  ApiPaginated,
  CreateClientInput,
  UpdateClientInput
} from "@/types/api/api.types";

const buildQuery = (page?: number, limit?: number): string => {
  const params = new URLSearchParams();

  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  const qs = params.toString();

  return qs ? `?${qs}` : "";
};

export const clientsApi = {
  list(restaurantId: string, page?: number, limit?: number): Promise<ApiPaginated<ApiClient>> {
    return api.get<ApiPaginated<ApiClient>>(`/restaurants/${restaurantId}/clients${buildQuery(page, limit)}`);
  },
  create(restaurantId: string, input: CreateClientInput): Promise<ApiClient> {
    return api.post<ApiClient>(`/restaurants/${restaurantId}/clients`, input);
  },
  update(restaurantId: string, id: string, input: UpdateClientInput): Promise<ApiClient> {
    return api.patch<ApiClient>(`/restaurants/${restaurantId}/clients/${id}`, input);
  },
  delete(restaurantId: string, id: string): Promise<void> {
    return api.delete<void>(`/restaurants/${restaurantId}/clients/${id}`);
  }
};
