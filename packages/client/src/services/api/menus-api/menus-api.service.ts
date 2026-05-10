import { apiRoutes, buildQuery } from "@workspace/shared";

import type {
  ApiMenu,
  ApiPaginated,
  CreateMenuInput,
  UpdateMenuInput
} from "@/types/api/api.types";

import { api } from "@/lib/api/api.client";


export const menusApi = {
  list(restaurantId: string, page?: number, limit?: number): Promise<ApiPaginated<ApiMenu>> {
    return api.get<ApiPaginated<ApiMenu>>(`${apiRoutes.restaurants.menus.base(restaurantId)}${buildQuery({ page, limit })}`);
  },
  create(restaurantId: string, input: CreateMenuInput): Promise<ApiMenu> {
    return api.post<ApiMenu>(apiRoutes.restaurants.menus.base(restaurantId), input);
  },
  update(restaurantId: string, id: string, input: UpdateMenuInput): Promise<ApiMenu> {
    return api.patch<ApiMenu>(apiRoutes.restaurants.menus.byId(restaurantId, id), input);
  },
  delete(restaurantId: string, id: string): Promise<void> {
    return api.delete<void>(apiRoutes.restaurants.menus.byId(restaurantId, id));
  }
};
