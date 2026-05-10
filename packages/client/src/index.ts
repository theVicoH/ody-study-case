export { useRestaurants } from "@/hooks/use-restaurants/use-restaurants.hook";

export { useApiRestaurants } from "@/hooks/use-api-restaurants/use-api-restaurants.hook";

export type { UseApiRestaurantsReturn } from "@/hooks/use-api-restaurants/use-api-restaurants.hook";

export { useRestaurantHours, buildDefaultOpeningHours } from "@/hooks/use-restaurant-hours/use-restaurant-hours.hook";

export type { UseRestaurantHoursReturn } from "@/hooks/use-restaurant-hours/use-restaurant-hours.hook";

export { useRestaurantTables } from "@/hooks/use-restaurant-tables/use-restaurant-tables.hook";

export type { UseRestaurantTablesReturn } from "@/hooks/use-restaurant-tables/use-restaurant-tables.hook";

export { restaurantHoursApi } from "@/services/api/restaurant-hours-api/restaurant-hours-api.service";

export { restaurantTablesApi } from "@/services/api/restaurant-tables-api/restaurant-tables-api.service";

export { useRestaurantSelectionStore } from "@/stores/restaurant-selection/restaurant-selection.store";

export { RESTAURANT_MODELS, DEFAULT_MODEL_ID, findModelById } from "@/lib/restaurant-visuals/restaurant-models.constant";

export type { RestaurantModelDef } from "@/lib/restaurant-visuals/restaurant-models.constant";

export type {
  ApiOpeningHour,
  ApiOrganization,
  ApiPaginated,
  ApiRestaurant,
  ApiRestaurantTable,
  ApiTableStatus,
  ApiTableZone,
  ApiUser,
  BulkGenerateTablesInput,
  CreateRestaurantInput,
  CreateTableInput,
  ListTablesQuery,
  UpdateRestaurantSettingsInput,
  UpdateTableInput
} from "@/types/api/api.types";

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
