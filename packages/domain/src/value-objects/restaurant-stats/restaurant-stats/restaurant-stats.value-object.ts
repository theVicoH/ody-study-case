export interface TopItemSnapshot {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly priceCents: number;
  readonly sold: number;
}

export interface RestaurantStatsSnapshotProps {
  readonly todayRevenueCents: number;
  readonly todayCovers: number;
  readonly avgTicketCents: number;
  readonly fillRate: number;
  readonly weeklyRevenueCents: ReadonlyArray<number>;
  readonly monthlyRevenueCents: ReadonlyArray<number>;
  readonly yearlyRevenueCents: ReadonlyArray<number>;
  readonly heatmap: ReadonlyArray<ReadonlyArray<number>>;
  readonly topItems: ReadonlyArray<TopItemSnapshot>;
  readonly sparklineData: ReadonlyArray<number>;
  readonly customers: number;
  readonly openOrders: number;
  readonly covers: number;
  readonly revenueCents: number;
  readonly orders: number;
  readonly trendPercent: number;
  readonly rating: number;
}

export class RestaurantStatsSnapshot {
  private constructor(private readonly props: RestaurantStatsSnapshotProps) {}

  static create(props: RestaurantStatsSnapshotProps): RestaurantStatsSnapshot {
    return new RestaurantStatsSnapshot(props);
  }

  toJSON(): RestaurantStatsSnapshotProps {
    return {
      ...this.props,
      weeklyRevenueCents: [...this.props.weeklyRevenueCents],
      monthlyRevenueCents: [...this.props.monthlyRevenueCents],
      yearlyRevenueCents: [...this.props.yearlyRevenueCents],
      heatmap: this.props.heatmap.map((row) => [...row]),
      topItems: this.props.topItems.map((it) => ({ ...it })),
      sparklineData: [...this.props.sparklineData]
    };
  }

  get todayRevenueCents(): number { return this.props.todayRevenueCents; }
  get todayCovers(): number { return this.props.todayCovers; }
  get avgTicketCents(): number { return this.props.avgTicketCents; }
  get fillRate(): number { return this.props.fillRate; }
  get weeklyRevenueCents(): ReadonlyArray<number> { return this.props.weeklyRevenueCents; }
  get monthlyRevenueCents(): ReadonlyArray<number> { return this.props.monthlyRevenueCents; }
  get yearlyRevenueCents(): ReadonlyArray<number> { return this.props.yearlyRevenueCents; }
  get heatmap(): ReadonlyArray<ReadonlyArray<number>> { return this.props.heatmap; }
  get topItems(): ReadonlyArray<TopItemSnapshot> { return this.props.topItems; }
  get sparklineData(): ReadonlyArray<number> { return this.props.sparklineData; }
  get customers(): number { return this.props.customers; }
  get openOrders(): number { return this.props.openOrders; }
  get covers(): number { return this.props.covers; }
  get revenueCents(): number { return this.props.revenueCents; }
  get orders(): number { return this.props.orders; }
  get trendPercent(): number { return this.props.trendPercent; }
  get rating(): number { return this.props.rating; }
}
