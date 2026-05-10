import type {
  IRestaurantStatsRepository,
  RestaurantId,
  RestaurantStatsRawData,
  StatsOrderInput
} from "@workspace/domain";

interface RestaurantBucket {
  orders: StatsOrderInput[];
  totalTables: number;
  occupiedTables: number;
  clientCount: number;
}

export class FakeRestaurantStatsRepository implements IRestaurantStatsRepository {
  private readonly buckets = new Map<string, RestaurantBucket>();

  seed(restaurantId: string, data: Partial<RestaurantBucket>): void {
    const cur = this.buckets.get(restaurantId) ?? {
      orders: [],
      totalTables: 0,
      occupiedTables: 0,
      clientCount: 0
    };

    this.buckets.set(restaurantId, {
      orders: data.orders ?? cur.orders,
      totalTables: data.totalTables ?? cur.totalTables,
      occupiedTables: data.occupiedTables ?? cur.occupiedTables,
      clientCount: data.clientCount ?? cur.clientCount
    });
  }

  async loadRawData(restaurantId: RestaurantId, since: Date): Promise<RestaurantStatsRawData> {
    const bucket = this.buckets.get(restaurantId.toString()) ?? {
      orders: [],
      totalTables: 0,
      occupiedTables: 0,
      clientCount: 0
    };

    return {
      orders: bucket.orders.filter((o) => o.placedAt >= since),
      totalTables: bucket.totalTables,
      occupiedTables: bucket.occupiedTables,
      clientCount: bucket.clientCount
    };
  }

  async loadRawDataForMany(
    restaurantIds: ReadonlyArray<RestaurantId>,
    since: Date
  ): Promise<RestaurantStatsRawData> {
    const orders: StatsOrderInput[] = [];
    let totalTables = 0;
    let occupiedTables = 0;
    let clientCount = 0;

    for (const id of restaurantIds) {
      const bucket = this.buckets.get(id.toString());

      if (!bucket) continue;

      for (const o of bucket.orders) {
        if (o.placedAt >= since) orders.push(o);
      }
      totalTables += bucket.totalTables;
      occupiedTables += bucket.occupiedTables;
      clientCount += bucket.clientCount;
    }

    return { orders, totalTables, occupiedTables, clientCount };
  }
}
