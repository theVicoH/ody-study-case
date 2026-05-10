import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import { clientsApi } from "@/services/api/clients-api/clients-api.service";

import type {
  ApiClient,
  ApiPaginated,
  CreateClientInput,
  UpdateClientInput
} from "@/types/api/api.types";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

const KEYS = {
  all: (restaurantId: string) => ["clients", restaurantId] as const,
  page: (restaurantId: string, page: number, limit: number) =>
    ["clients", restaurantId, page, limit] as const
};

export const useClients = (
  restaurantId: string,
  page?: number,
  limit?: number
): UseQueryResult<ApiPaginated<ApiClient>> =>
  useQuery({
    queryKey: page !== undefined && limit !== undefined
      ? KEYS.page(restaurantId, page, limit)
      : KEYS.all(restaurantId),
    queryFn: () => clientsApi.list(restaurantId, page, limit),
    enabled: Boolean(restaurantId)
  });

export const useCreateClient = (
  restaurantId: string
): UseMutationResult<ApiClient, Error, CreateClientInput> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateClientInput) => clientsApi.create(restaurantId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all(restaurantId) })
  });
};

export const useUpdateClient = (
  restaurantId: string
): UseMutationResult<ApiClient, Error, { id: string; input: UpdateClientInput }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateClientInput }) =>
      clientsApi.update(restaurantId, id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all(restaurantId) })
  });
};

export const useDeleteClient = (restaurantId: string): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsApi.delete(restaurantId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEYS.all(restaurantId) })
  });
};

export interface MultiClientsResult {
  byRestaurant: Map<string, ApiClient[]>;
  flat: ApiClient[];
  isLoading: boolean;
}

export const useClientsMulti = (restaurantIds: ReadonlyArray<string>): MultiClientsResult => {
  const results = useQueries({
    queries: restaurantIds.map((id) => ({
      queryKey: KEYS.all(id),
      queryFn: () => clientsApi.list(id),
      enabled: Boolean(id)
    }))
  });

  const byRestaurant = new Map<string, ApiClient[]>();
  const flat: ApiClient[] = [];

  results.forEach((res, idx) => {
    const id = restaurantIds[idx];

    if (!id) return;
    const data = res.data?.data ?? [];

    byRestaurant.set(id, data);
    flat.push(...data);
  });

  return { byRestaurant, flat, isLoading: results.some((r) => r.isLoading) };
};
