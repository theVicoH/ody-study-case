import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import { ordersApi } from "@/services/api/orders-api/orders-api.service";

import type {
  ApiOrder,
  ApiOrderStatus,
  ApiPaginated,
  CreateOrderInput
} from "@/types/api/api.types";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

const KEYS = {
  all: (restaurantId: string) => ["orders", restaurantId] as const,
  byClient: (restaurantId: string, clientId: string) => ["orders", restaurantId, "client", clientId] as const
};

export const useOrders = (
  restaurantId: string,
  clientId?: string
): UseQueryResult<ApiPaginated<ApiOrder>> =>
  useQuery({
    queryKey: clientId ? KEYS.byClient(restaurantId, clientId) : KEYS.all(restaurantId),
    queryFn: () => ordersApi.list(restaurantId, { clientId }),
    enabled: Boolean(restaurantId)
  });

export const useCreateOrder = (
  restaurantId: string
): UseMutationResult<ApiOrder, Error, CreateOrderInput> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersApi.create(restaurantId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders", restaurantId] })
  });
};

export const useUpdateOrderStatus = (
  restaurantId: string
): UseMutationResult<ApiOrder, Error, { id: string; status: ApiOrderStatus }> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApiOrderStatus }) =>
      ordersApi.updateStatus(restaurantId, id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders", restaurantId] })
  });
};

export const useDeleteOrder = (restaurantId: string): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersApi.delete(restaurantId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders", restaurantId] })
  });
};

export interface MultiOrdersResult {
  byRestaurant: Map<string, ApiOrder[]>;
  flat: ApiOrder[];
  isLoading: boolean;
}

export const useOrdersMulti = (restaurantIds: ReadonlyArray<string>): MultiOrdersResult => {
  const results = useQueries({
    queries: restaurantIds.map((id) => ({
      queryKey: KEYS.all(id),
      queryFn: () => ordersApi.list(id),
      enabled: Boolean(id)
    }))
  });

  const byRestaurant = new Map<string, ApiOrder[]>();
  const flat: ApiOrder[] = [];

  results.forEach((res, idx) => {
    const id = restaurantIds[idx];

    if (!id) return;
    const data = res.data?.data ?? [];

    byRestaurant.set(id, data);
    flat.push(...data);
  });

  return { byRestaurant, flat, isLoading: results.some((r) => r.isLoading) };
};
