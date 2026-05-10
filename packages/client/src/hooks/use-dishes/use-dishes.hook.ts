import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";


import type { ApiDish, ApiPaginated, CreateDishInput, UpdateDishInput } from "@/types/api/api.types";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

import { dishesApi } from "@/services/api/dishes-api/dishes-api.service";

const KEYS = {
  all: (restaurantId: string) => ["dishes", restaurantId] as const
};

export const useDishes = (restaurantId: string): UseQueryResult<ApiPaginated<ApiDish>> =>
  useQuery({
    queryKey: KEYS.all(restaurantId),
    queryFn: () => dishesApi.list(restaurantId),
    enabled: Boolean(restaurantId)
  });

export const useCreateDish = (restaurantId: string): UseMutationResult<ApiDish, Error, CreateDishInput> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDishInput) => dishesApi.create(restaurantId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all(restaurantId) })
  });
};

export const useUpdateDish = (restaurantId: string): UseMutationResult<ApiDish, Error, { id: string; input: UpdateDishInput }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDishInput }) =>
      dishesApi.update(restaurantId, id, input),
    onSuccess: (updatedDish) => {
      queryClient.setQueryData<ApiPaginated<ApiDish>>(KEYS.all(restaurantId), (old) => {
        if (!old) return old;

        return { ...old, data: old.data.map((d) => d.id === updatedDish.id ? updatedDish : d) };
      });
      void queryClient.invalidateQueries({ queryKey: KEYS.all(restaurantId) });
    }
  });
};

export const useDeleteDish = (restaurantId: string): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dishesApi.delete(restaurantId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all(restaurantId) })
  });
};

export interface MultiDishesResult {
  byRestaurant: Map<string, ApiDish[]>;
  flat: ApiDish[];
  isLoading: boolean;
}

export const useDishesMulti = (restaurantIds: ReadonlyArray<string>): MultiDishesResult => {
  const results = useQueries({
    queries: restaurantIds.map((id) => ({
      queryKey: KEYS.all(id),
      queryFn: () => dishesApi.list(id),
      enabled: Boolean(id)
    }))
  });

  const byRestaurant = new Map<string, ApiDish[]>();
  const flat: ApiDish[] = [];

  results.forEach((res, idx) => {
    const id = restaurantIds[idx];

    if (!id) return;
    const data = res.data?.data ?? [];

    byRestaurant.set(id, data);
    flat.push(...data);
  });

  return { byRestaurant, flat, isLoading: results.some((r) => r.isLoading) };
};
