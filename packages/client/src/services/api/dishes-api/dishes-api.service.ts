import { apiRoutes, buildQuery } from "@workspace/shared";

import type {
  ApiDish,
  ApiPaginated,
  CreateDishInput,
  UpdateDishInput
} from "@/types/api/api.types";

import { api } from "@/lib/api/api.client";


export const dishesApi = {
  list(restaurantId: string, page?: number, limit?: number): Promise<ApiPaginated<ApiDish>> {
    return api.get<ApiPaginated<ApiDish>>(`${apiRoutes.restaurants.dishes.base(restaurantId)}${buildQuery({ page, limit })}`);
  },
  create(restaurantId: string, input: CreateDishInput): Promise<ApiDish> {
    return api.post<ApiDish>(apiRoutes.restaurants.dishes.base(restaurantId), input);
  },
  update(restaurantId: string, id: string, input: UpdateDishInput): Promise<ApiDish> {
    return api.patch<ApiDish>(apiRoutes.restaurants.dishes.byId(restaurantId, id), input);
  },
  delete(restaurantId: string, id: string): Promise<void> {
    return api.delete<void>(apiRoutes.restaurants.dishes.byId(restaurantId, id));
  }
};
