import { apiRoutes, buildQuery } from "@workspace/shared";

import type {
  ApiOrder,
  ApiOrderStatus,
  ApiPaginated,
  CreateOrderInput,
  ListOrdersQuery
} from "@/types/api/api.types";

import { api } from "@/lib/api/api.client";


export const ordersApi = {
  list(restaurantId: string, query?: ListOrdersQuery): Promise<ApiPaginated<ApiOrder>> {
    return api.get<ApiPaginated<ApiOrder>>(`${apiRoutes.restaurants.orders.base(restaurantId)}${buildQuery({
      page: query?.page,
      limit: query?.limit,
      clientId: query?.clientId
    })}`);
  },
  get(restaurantId: string, id: string): Promise<ApiOrder> {
    return api.get<ApiOrder>(apiRoutes.restaurants.orders.byId(restaurantId, id));
  },
  create(restaurantId: string, input: CreateOrderInput): Promise<ApiOrder> {
    return api.post<ApiOrder>(apiRoutes.restaurants.orders.base(restaurantId), input);
  },
  updateStatus(restaurantId: string, id: string, status: ApiOrderStatus): Promise<ApiOrder> {
    return api.patch<ApiOrder>(apiRoutes.restaurants.orders.status(restaurantId, id), { status });
  },
  delete(restaurantId: string, id: string): Promise<void> {
    return api.delete<void>(apiRoutes.restaurants.orders.byId(restaurantId, id));
  }
};
