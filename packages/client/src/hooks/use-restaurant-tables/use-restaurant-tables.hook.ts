import { useCallback, useEffect, useState } from "react";

import { restaurantTablesApi } from "@/services/api/restaurant-tables-api/restaurant-tables-api.service";

import type {
  ApiRestaurantTable,
  BulkGenerateTablesInput,
  CreateTableInput,
  ListTablesQuery,
  UpdateTableInput
} from "@/types/api/api.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export interface UseRestaurantTablesReturn {
  tables: ReadonlyArray<ApiRestaurantTable>;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  reload: () => Promise<void>;
  create: (input: CreateTableInput) => Promise<ApiRestaurantTable>;
  update: (id: string, input: UpdateTableInput) => Promise<ApiRestaurantTable>;
  remove: (id: string) => Promise<void>;
  bulkGenerate: (input: BulkGenerateTablesInput) => Promise<void>;
}

export function useRestaurantTables(
  restaurantId: string | null | undefined,
  initialQuery?: Omit<ListTablesQuery, "page" | "limit">
): UseRestaurantTablesReturn {
  const [tables, setTables] = useState<ReadonlyArray<ApiRestaurantTable>>([]);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    if (!restaurantId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await restaurantTablesApi.list(restaurantId, { ...initialQuery, page, limit });

      setTables(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tables");
    } finally {
      setLoading(false);
    }
  }, [restaurantId, page, limit, initialQuery]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(async (input: CreateTableInput): Promise<ApiRestaurantTable> => {
    if (!restaurantId) throw new Error("No restaurant selected");
    const created = await restaurantTablesApi.create(restaurantId, input);

    await load();

    return created;
  }, [restaurantId, load]);

  const update = useCallback(async (id: string, input: UpdateTableInput): Promise<ApiRestaurantTable> => {
    if (!restaurantId) throw new Error("No restaurant selected");
    const updated = await restaurantTablesApi.update(restaurantId, id, input);

    setTables((prev) => prev.map((t) => (t.id === id ? updated : t)));

    return updated;
  }, [restaurantId]);

  const remove = useCallback(async (id: string): Promise<void> => {
    if (!restaurantId) throw new Error("No restaurant selected");
    await restaurantTablesApi.delete(restaurantId, id);
    await load();
  }, [restaurantId, load]);

  const bulkGenerate = useCallback(async (input: BulkGenerateTablesInput): Promise<void> => {
    if (!restaurantId) throw new Error("No restaurant selected");
    await restaurantTablesApi.bulkGenerate(restaurantId, input);
    await load();
  }, [restaurantId, load]);

  return {
    tables,
    page,
    limit,
    total,
    totalPages,
    loading,
    error,
    setPage,
    setLimit,
    reload: load,
    create,
    update,
    remove,
    bulkGenerate
  };
}
