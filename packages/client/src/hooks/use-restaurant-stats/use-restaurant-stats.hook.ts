import { useQueries, useQuery } from "@tanstack/react-query";

import type { ApiRestaurantStats } from "@/types/api/api.types";
import type { RestaurantDetailedStats } from "@/types/restaurant/restaurant.types";
import type { UseQueryResult } from "@tanstack/react-query";

import { restaurantStatsApi } from "@/services/api/restaurant-stats-api/restaurant-stats-api.service";

const CENTS_PER_EURO = 100;
const PERCENT_PREFIX_PLUS = "+";
const PERCENT_PREFIX_MINUS = "−";

const KEYS = {
  one: (restaurantId: string) => ["restaurant-stats", restaurantId] as const,
  group: (ids: ReadonlyArray<string>) => ["restaurant-stats", "group", ...ids] as const
};

const formatTrend = (percent: number): string => {
  if (percent === 0) return "+0%";
  if (percent > 0) return `${PERCENT_PREFIX_PLUS}${percent}%`;

  return `${PERCENT_PREFIX_MINUS}${Math.abs(percent)}%`;
};

const centsToEuros = (cents: number): number => Math.round(cents / CENTS_PER_EURO);

export const mapApiStatsToDetailed = (api: ApiRestaurantStats): RestaurantDetailedStats => ({
  covers: api.covers,
  revenue: centsToEuros(api.revenueCents),
  orders: api.orders,
  rating: api.rating.toFixed(1),
  trend: formatTrend(api.trendPercent),
  todayCovers: api.todayCovers,
  todayRevenue: centsToEuros(api.todayRevenueCents),
  avgTicket: centsToEuros(api.avgTicketCents),
  fillRate: api.fillRate,
  weeklyRevenue: api.weeklyRevenueCents.map(centsToEuros),
  monthlyRevenue: api.monthlyRevenueCents.map(centsToEuros),
  yearlyRevenue: api.yearlyRevenueCents.map(centsToEuros),
  heatmap: api.heatmap,
  topItems: api.topItems.map((it) => ({
    name: it.name,
    category: it.category,
    price: centsToEuros(it.priceCents),
    sold: it.sold
  })),
  sparklineData: api.sparklineData,
  customers: api.customers,
  openOrders: api.openOrders
});

export interface UseRestaurantStatsReturn {
  stats: RestaurantDetailedStats | null;
  isLoading: boolean;
  isError: boolean;
}

const toReturn = (query: UseQueryResult<ApiRestaurantStats>): UseRestaurantStatsReturn => ({
  stats: query.data ? mapApiStatsToDetailed(query.data) : null,
  isLoading: query.isPending,
  isError: query.isError
});

export const useRestaurantStats = (restaurantId: string): UseRestaurantStatsReturn => {
  const query = useQuery({
    queryKey: KEYS.one(restaurantId),
    queryFn: () => restaurantStatsApi.get(restaurantId),
    enabled: Boolean(restaurantId)
  });

  return toReturn(query);
};

export const useGroupStats = (restaurantIds: ReadonlyArray<string>): UseRestaurantStatsReturn => {
  const query = useQuery({
    queryKey: KEYS.group(restaurantIds),
    queryFn: () => restaurantStatsApi.getGroup(restaurantIds),
    enabled: restaurantIds.length > 0
  });

  return toReturn(query);
};

export interface UseRestaurantStatsMultiReturn {
  byRestaurant: Map<string, RestaurantDetailedStats>;
  isLoading: boolean;
}

export const useRestaurantStatsMulti = (restaurantIds: ReadonlyArray<string>): UseRestaurantStatsMultiReturn => {
  const results = useQueries({
    queries: restaurantIds.map((id) => ({
      queryKey: KEYS.one(id),
      queryFn: () => restaurantStatsApi.get(id),
      enabled: Boolean(id)
    }))
  });

  const byRestaurant = new Map<string, RestaurantDetailedStats>();

  results.forEach((res, idx) => {
    const id = restaurantIds[idx];

    if (!id || !res.data) return;
    byRestaurant.set(id, mapApiStatsToDetailed(res.data));
  });

  return { byRestaurant, isLoading: results.some((r) => r.isPending) };
};
