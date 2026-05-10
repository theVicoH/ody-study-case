import { apiRoutes, buildQuery } from "@workspace/shared";

import type {
  ApiClient,
  ApiPaginated,
  CreateClientInput,
  UpdateClientInput
} from "@/types/api/api.types";

import { api } from "@/lib/api/api.client";


export const clientsApi = {
  list(restaurantId: string, page?: number, limit?: number): Promise<ApiPaginated<ApiClient>> {
    return api.get<ApiPaginated<ApiClient>>(`${apiRoutes.restaurants.clients.base(restaurantId)}${buildQuery({ page, limit })}`);
  },
  create(restaurantId: string, input: CreateClientInput): Promise<ApiClient> {
    return api.post<ApiClient>(apiRoutes.restaurants.clients.base(restaurantId), input);
  },
  update(restaurantId: string, id: string, input: UpdateClientInput): Promise<ApiClient> {
    return api.patch<ApiClient>(apiRoutes.restaurants.clients.byId(restaurantId, id), input);
  },
  delete(restaurantId: string, id: string): Promise<void> {
    return api.delete<void>(apiRoutes.restaurants.clients.byId(restaurantId, id));
  }
};
