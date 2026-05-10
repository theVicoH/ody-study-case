import type { RestaurantStatsResponseDTO } from "@/dtos/restaurant-stats/restaurant-stats.dto";
import type { RestaurantStatsSnapshot } from "@workspace/domain";

export const RestaurantStatsMapper = {
  toResponseDTO(snapshot: RestaurantStatsSnapshot): RestaurantStatsResponseDTO {
    return {
      todayRevenueCents: snapshot.todayRevenueCents,
      todayCovers: snapshot.todayCovers,
      avgTicketCents: snapshot.avgTicketCents,
      fillRate: snapshot.fillRate,
      weeklyRevenueCents: [...snapshot.weeklyRevenueCents],
      monthlyRevenueCents: [...snapshot.monthlyRevenueCents],
      yearlyRevenueCents: [...snapshot.yearlyRevenueCents],
      heatmap: snapshot.heatmap.map((row) => [...row]),
      topItems: snapshot.topItems.map((it) => ({
        id: it.id,
        name: it.name,
        category: it.category,
        priceCents: it.priceCents,
        sold: it.sold
      })),
      sparklineData: [...snapshot.sparklineData],
      customers: snapshot.customers,
      openOrders: snapshot.openOrders,
      covers: snapshot.covers,
      revenueCents: snapshot.revenueCents,
      orders: snapshot.orders,
      trendPercent: snapshot.trendPercent,
      rating: snapshot.rating
    };
  }
};
