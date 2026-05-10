import { useCallback, useEffect, useState } from "react";

import type { ApiOpeningHour } from "@/types/api/api.types";

import { restaurantHoursApi } from "@/services/api/restaurant-hours-api/restaurant-hours-api.service";


const DAYS_IN_WEEK = 7;

const DEFAULT_OPEN_TIME = "12:00";
const DEFAULT_CLOSE_TIME = "22:30";

const buildDefaultHours = (): ApiOpeningHour[] =>
  Array.from({ length: DAYS_IN_WEEK }, (_, dayOfWeek) => ({
    dayOfWeek,
    isOpen: dayOfWeek !== 0,
    openTime: DEFAULT_OPEN_TIME,
    closeTime: DEFAULT_CLOSE_TIME
  }));

const mergeWithDefaults = (rows: ReadonlyArray<ApiOpeningHour>): ApiOpeningHour[] => {
  const base = buildDefaultHours();
  const byDay = new Map(rows.map((r) => [r.dayOfWeek, r]));

  return base.map((d) => byDay.get(d.dayOfWeek) ?? d);
};

export interface UseRestaurantHoursReturn {
  hours: ApiOpeningHour[];
  loading: boolean;
  error: string | null;
  save: (hours: ReadonlyArray<ApiOpeningHour>) => Promise<void>;
  reload: () => Promise<void>;
}

export const buildDefaultOpeningHours = buildDefaultHours;

export function useRestaurantHours(restaurantId: string | null | undefined): UseRestaurantHoursReturn {
  const [hours, setHours] = useState<ApiOpeningHour[]>(buildDefaultHours());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    if (!restaurantId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await restaurantHoursApi.list(restaurantId);

      setHours(mergeWithDefaults(res.data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load opening hours");
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(async (next: ReadonlyArray<ApiOpeningHour>): Promise<void> => {
    if (!restaurantId) return;
    const res = await restaurantHoursApi.upsert(restaurantId, next);

    setHours(mergeWithDefaults(res.data));
  }, [restaurantId]);

  return { hours, loading, error, save, reload: load };
}
