export interface TopItemResponseDTO {
  id: string;
  name: string;
  category: string;
  priceCents: number;
  sold: number;
}

export interface RestaurantStatsResponseDTO {
  todayRevenueCents: number;
  todayCovers: number;
  avgTicketCents: number;
  fillRate: number;
  weeklyRevenueCents: number[];
  monthlyRevenueCents: number[];
  yearlyRevenueCents: number[];
  heatmap: number[][];
  topItems: TopItemResponseDTO[];
  sparklineData: number[];
  customers: number;
  openOrders: number;
  covers: number;
  revenueCents: number;
  orders: number;
  trendPercent: number;
  rating: number;
}

export interface GetRestaurantStatsDTO {
  restaurantId: string;
  now?: Date;
}

export interface GetGroupStatsDTO {
  restaurantIds: string[];
  now?: Date;
}
