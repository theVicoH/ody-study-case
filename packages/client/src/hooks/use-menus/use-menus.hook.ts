import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { menusApi } from "@/services/api/menus-api/menus-api.service";

import type { ApiMenu, ApiPaginated, CreateMenuInput, UpdateMenuInput } from "@/types/api/api.types";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

const KEYS = {
  all: (restaurantId: string) => ["menus", restaurantId] as const
};

export const useMenus = (restaurantId: string): UseQueryResult<ApiPaginated<ApiMenu>> =>
  useQuery({
    queryKey: KEYS.all(restaurantId),
    queryFn: () => menusApi.list(restaurantId),
    enabled: Boolean(restaurantId)
  });

export const useCreateMenu = (
  restaurantId: string
): UseMutationResult<ApiMenu, Error, CreateMenuInput> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMenuInput) => menusApi.create(restaurantId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all(restaurantId) })
  });
};

export const useUpdateMenu = (
  restaurantId: string
): UseMutationResult<ApiMenu, Error, { id: string; input: UpdateMenuInput }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateMenuInput }) =>
      menusApi.update(restaurantId, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all(restaurantId) })
  });
};

export const useDeleteMenu = (restaurantId: string): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menusApi.delete(restaurantId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all(restaurantId) })
  });
};
