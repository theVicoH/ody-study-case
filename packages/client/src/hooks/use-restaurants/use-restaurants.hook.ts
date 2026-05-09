import { useMemo } from "react";

import type {
  Restaurant,
  RestaurantCustomer,
  RestaurantDetailedStats,
  RestaurantMenuItem,
  RestaurantOrder,
  RestaurantPerformance,
  RestaurantSettings,
  RestaurantStats
} from "@/types/restaurant/restaurant.types";

import {
  computeRestaurantDetailedStats,
  computeRestaurantStats,
  getRestaurantSettings,
  listRestaurantCustomers,
  listRestaurantMenuItems,
  listRestaurantOrders,
  listRestaurants
} from "@/services/restaurants/restaurants.service";

export interface RestaurantsSummary {
  total: number;
  good: number;
  warn: number;
  bad: number;
  worstCount: number;
  worstLabel: string;
  worstClass: RestaurantPerformance;
}

export interface UseRestaurantsReturn {
  restaurants: ReadonlyArray<Restaurant>;
  summary: RestaurantsSummary;
  statsFor: (restaurant: Restaurant) => RestaurantStats;
  detailedStatsFor: (restaurant: Restaurant) => RestaurantDetailedStats;
  customersFor: (restaurant: Restaurant) => ReadonlyArray<RestaurantCustomer>;
  ordersFor: (restaurant: Restaurant) => ReadonlyArray<RestaurantOrder>;
  menuItemsFor: (restaurant: Restaurant) => ReadonlyArray<RestaurantMenuItem>;
  settingsFor: (restaurant: Restaurant) => RestaurantSettings;
}

const SUMMARY_LABEL_BAD = "resto(s) en alerte";
const SUMMARY_LABEL_WARN = "à surveiller";
const SUMMARY_LABEL_OK = "Tout va bien";

function buildSummary(restaurants: ReadonlyArray<Restaurant>): RestaurantsSummary {
  const good = restaurants.filter((r) => r.performance === "good").length;
  const warn = restaurants.filter((r) => r.performance === "warn").length;
  const bad = restaurants.filter((r) => r.performance === "bad").length;

  if (bad > 0) {
    return {
      total: restaurants.length,
      good,
      warn,
      bad,
      worstCount: bad,
      worstClass: "bad",
      worstLabel: `${bad} ${SUMMARY_LABEL_BAD}`
    };
  }

  if (warn > 0) {
    return {
      total: restaurants.length,
      good,
      warn,
      bad,
      worstCount: warn,
      worstClass: "warn",
      worstLabel: `${warn} ${SUMMARY_LABEL_WARN}`
    };
  }

  return {
    total: restaurants.length,
    good,
    warn,
    bad,
    worstCount: 0,
    worstClass: "good",
    worstLabel: SUMMARY_LABEL_OK
  };
}

export function useRestaurants(): UseRestaurantsReturn {
  const restaurants = useMemo(() => listRestaurants(), []);
  const summary = useMemo(() => buildSummary(restaurants), [restaurants]);

  return {
    restaurants,
    summary,
    statsFor: computeRestaurantStats,
    detailedStatsFor: computeRestaurantDetailedStats,
    customersFor: listRestaurantCustomers,
    ordersFor: listRestaurantOrders,
    menuItemsFor: listRestaurantMenuItems,
    settingsFor: getRestaurantSettings
  };
}
