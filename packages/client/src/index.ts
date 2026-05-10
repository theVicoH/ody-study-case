export { useRestaurants } from "@/hooks/use-restaurants/use-restaurants.hook";

export { useApiRestaurants } from "@/hooks/use-api-restaurants/use-api-restaurants.hook";

export type { UseApiRestaurantsReturn } from "@/hooks/use-api-restaurants/use-api-restaurants.hook";

export { useRestaurantSelectionStore } from "@/stores/restaurant-selection/restaurant-selection.store";

export { RESTAURANT_MODELS, DEFAULT_MODEL_ID, findModelById } from "@/lib/restaurant-visuals/restaurant-models.constant";

export type { RestaurantModelDef } from "@/lib/restaurant-visuals/restaurant-models.constant";

export type { ApiOrganization, ApiRestaurant, ApiUser, CreateRestaurantInput } from "@/types/api/api.types";

export { ApiError } from "@/lib/api/api.client";

export type {
  CustomerTag,
  Restaurant,
  RestaurantCustomer,
  RestaurantDetailedStats,
  RestaurantMenuItem,
  RestaurantOrder,
  OrderStatus,
  RestaurantPerformance,
  RestaurantSettings,
  RestaurantStats,
  RestaurantTable,
  RestaurantTopItem,
  TableStatus,
  TableZone
} from "@/types/restaurant/restaurant.types";
