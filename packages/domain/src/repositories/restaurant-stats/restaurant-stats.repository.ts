import type { StatsOrderInput } from "@/services/restaurant-stats/restaurant-stats.calculator";
import type { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";

export interface RestaurantStatsRawData {
  readonly orders: ReadonlyArray<StatsOrderInput>;
  readonly totalTables: number;
  readonly occupiedTables: number;
  readonly clientCount: number;
}

export interface IRestaurantStatsRepository {
  loadRawData(restaurantId: RestaurantId, since: Date): Promise<RestaurantStatsRawData>;
  loadRawDataForMany(restaurantIds: ReadonlyArray<RestaurantId>, since: Date): Promise<RestaurantStatsRawData>;
}
