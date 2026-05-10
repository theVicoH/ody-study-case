import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";


import type { ApiMenu, ApiPaginated, CreateMenuInput, UpdateMenuInput } from "@/types/api/api.types";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

import { menusApi } from "@/services/api/menus-api/menus-api.service";

const KEYS = {
  all: (restaurantId: string) => ["menus", restaurantId] as const
};

export const useMenus = (restaurantId: string): UseQueryResult<ApiPaginated<ApiMenu>> =>
  useQuery({
    queryKey: KEYS.all(restaurantId),
    queryFn: () => menusApi.list(restaurantId),
    enabled: Boolean(restaurantId)
  });

export const useCreateMenu = (restaurantId: string): UseMutationResult<ApiMenu, Error, CreateMenuInput> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMenuInput) => menusApi.create(restaurantId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all(restaurantId) })
  });
};

export const useUpdateMenu = (restaurantId: string): UseMutationResult<ApiMenu, Error, { id: string; input: UpdateMenuInput }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateMenuInput }) =>
      menusApi.update(restaurantId, id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: KEYS.all(restaurantId) });
    }
  });
};

export const useDeleteMenu = (restaurantId: string): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menusApi.delete(restaurantId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all(restaurantId) })
  });
};

export interface MultiMenusResult {
  byRestaurant: Map<string, ApiMenu[]>;
  flat: ApiMenu[];
  isLoading: boolean;
}

export const useMenusMulti = (restaurantIds: ReadonlyArray<string>): MultiMenusResult => {
  const results = useQueries({
    queries: restaurantIds.map((id) => ({
      queryKey: KEYS.all(id),
      queryFn: () => menusApi.list(id),
      enabled: Boolean(id)
    }))
  });

  const byRestaurant = new Map<string, ApiMenu[]>();
  const flat: ApiMenu[] = [];

  results.forEach((res, idx) => {
    const id = restaurantIds[idx];

    if (!id) return;
    const data = res.data?.data ?? [];

    byRestaurant.set(id, data);
    flat.push(...data);
  });

  return { byRestaurant, flat, isLoading: results.some((r) => r.isLoading) };
};
