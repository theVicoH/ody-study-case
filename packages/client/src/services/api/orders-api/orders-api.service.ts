import { api } from "@/lib/api/api.client";

import type {
  ApiOrder,
  ApiOrderStatus,
  ApiPaginated,
  CreateOrderInput,
  ListOrdersQuery
} from "@/types/api/api.types";

const buildQuery = (query?: ListOrdersQuery): string => {
  const params = new URLSearchParams();

  if (query?.page) params.set("page", String(query.page));
  if (query?.limit) params.set("limit", String(query.limit));
  if (query?.clientId) params.set("clientId", query.clientId);
  const qs = params.toString();

  return qs ? `?${qs}` : "";
};

export const ordersApi = {
  list(restaurantId: string, query?: ListOrdersQuery): Promise<ApiPaginated<ApiOrder>> {
    return api.get<ApiPaginated<ApiOrder>>(`/restaurants/${restaurantId}/orders${buildQuery(query)}`);
  },
  get(restaurantId: string, id: string): Promise<ApiOrder> {
    return api.get<ApiOrder>(`/restaurants/${restaurantId}/orders/${id}`);
  },
  create(restaurantId: string, input: CreateOrderInput): Promise<ApiOrder> {
    return api.post<ApiOrder>(`/restaurants/${restaurantId}/orders`, input);
  },
  updateStatus(restaurantId: string, id: string, status: ApiOrderStatus): Promise<ApiOrder> {
    return api.patch<ApiOrder>(`/restaurants/${restaurantId}/orders/${id}/status`, { status });
  },
  delete(restaurantId: string, id: string): Promise<void> {
    return api.delete<void>(`/restaurants/${restaurantId}/orders/${id}`);
  }
};
