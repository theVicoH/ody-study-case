import { RestaurantId, restaurantStatsCalculator } from "@workspace/domain";

import type {
  GetGroupStatsDTO,
  GetRestaurantStatsDTO,
  RestaurantStatsResponseDTO
} from "@/dtos/restaurant-stats/restaurant-stats.dto";
import type { IRestaurantStatsRepository } from "@workspace/domain";


import { RestaurantStatsMapper } from "@/mappers/restaurant-stats/restaurant-stats.mapper";

const STATS_LOOKBACK_YEARS = 5;
const MS_PER_DAY = 86_400_000;
const DAYS_PER_YEAR = 366;

const buildSince = (now: Date): Date => new Date(now.getTime() - STATS_LOOKBACK_YEARS * DAYS_PER_YEAR * MS_PER_DAY);

export class GetRestaurantStatsUseCase {
  constructor(private readonly repo: IRestaurantStatsRepository) {}

  async execute(dto: GetRestaurantStatsDTO): Promise<RestaurantStatsResponseDTO> {
    const now = dto.now ?? new Date();
    const since = buildSince(now);
    const restaurantId = RestaurantId.create(dto.restaurantId);
    const raw = await this.repo.loadRawData(restaurantId, since);

    const snapshot = restaurantStatsCalculator.calculate({
      orders: raw.orders,
      totalTables: raw.totalTables,
      occupiedTables: raw.occupiedTables,
      clientCount: raw.clientCount,
      now
    });

    return RestaurantStatsMapper.toResponseDTO(snapshot);
  }
}

export class GetGroupStatsUseCase {
  constructor(private readonly repo: IRestaurantStatsRepository) {}

  async execute(dto: GetGroupStatsDTO): Promise<RestaurantStatsResponseDTO> {
    const now = dto.now ?? new Date();
    const since = buildSince(now);
    const ids = dto.restaurantIds.map((id) => RestaurantId.create(id));
    const raw = await this.repo.loadRawDataForMany(ids, since);

    const snapshot = restaurantStatsCalculator.calculate({
      orders: raw.orders,
      totalTables: raw.totalTables,
      occupiedTables: raw.occupiedTables,
      clientCount: raw.clientCount,
      now
    });

    return RestaurantStatsMapper.toResponseDTO(snapshot);
  }
}
