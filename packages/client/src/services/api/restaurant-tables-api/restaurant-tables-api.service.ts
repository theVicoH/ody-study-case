import { apiRoutes, buildQuery } from "@workspace/shared";

import type {
  ApiPaginated,
  ApiRestaurantTable,
  BulkGenerateTablesInput,
  CreateTableInput,
  ListTablesQuery,
  UpdateTableInput
} from "@/types/api/api.types";

import { api } from "@/lib/api/api.client";


export const restaurantTablesApi = {
  list(restaurantId: string, query?: ListTablesQuery): Promise<ApiPaginated<ApiRestaurantTable>> {
    return api.get<ApiPaginated<ApiRestaurantTable>>(`${apiRoutes.restaurants.tables.base(restaurantId)}${buildQuery({
      page: query?.page,
      limit: query?.limit,
      zone: query?.zone,
      status: query?.status
    })}`);
  },
  create(restaurantId: string, input: CreateTableInput): Promise<ApiRestaurantTable> {
    return api.post<ApiRestaurantTable>(apiRoutes.restaurants.tables.base(restaurantId), input);
  },
  update(restaurantId: string, id: string, input: UpdateTableInput): Promise<ApiRestaurantTable> {
    return api.patch<ApiRestaurantTable>(apiRoutes.restaurants.tables.byId(restaurantId, id), input);
  },
  delete(restaurantId: string, id: string): Promise<void> {
    return api.delete<void>(apiRoutes.restaurants.tables.byId(restaurantId, id));
  },
  bulkGenerate(restaurantId: string, input: BulkGenerateTablesInput): Promise<ApiPaginated<ApiRestaurantTable>> {
    return api.post<ApiPaginated<ApiRestaurantTable>>(
      apiRoutes.restaurants.tables.bulkGenerate(restaurantId),
      input
    );
  }
};
