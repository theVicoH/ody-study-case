import { api } from "@/lib/api/api.client";

import type {
  ApiPaginated,
  ApiRestaurantTable,
  BulkGenerateTablesInput,
  CreateTableInput,
  ListTablesQuery,
  UpdateTableInput
} from "@/types/api/api.types";

const buildQuery = (query?: ListTablesQuery): string => {
  const params = new URLSearchParams();

  if (query?.page) params.set("page", String(query.page));
  if (query?.limit) params.set("limit", String(query.limit));
  if (query?.zone) params.set("zone", query.zone);
  if (query?.status) params.set("status", query.status);
  const qs = params.toString();

  return qs ? `?${qs}` : "";
};

export const restaurantTablesApi = {
  list(restaurantId: string, query?: ListTablesQuery): Promise<ApiPaginated<ApiRestaurantTable>> {
    return api.get<ApiPaginated<ApiRestaurantTable>>(`/restaurants/${restaurantId}/tables${buildQuery(query)}`);
  },
  create(restaurantId: string, input: CreateTableInput): Promise<ApiRestaurantTable> {
    return api.post<ApiRestaurantTable>(`/restaurants/${restaurantId}/tables`, input);
  },
  update(restaurantId: string, id: string, input: UpdateTableInput): Promise<ApiRestaurantTable> {
    return api.patch<ApiRestaurantTable>(`/restaurants/${restaurantId}/tables/${id}`, input);
  },
  delete(restaurantId: string, id: string): Promise<void> {
    return api.delete<void>(`/restaurants/${restaurantId}/tables/${id}`);
  },
  bulkGenerate(restaurantId: string, input: BulkGenerateTablesInput): Promise<ApiPaginated<ApiRestaurantTable>> {
    return api.post<ApiPaginated<ApiRestaurantTable>>(`/restaurants/${restaurantId}/tables/bulk-generate`, input);
  }
};
