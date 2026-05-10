export { useRestaurants } from "@/hooks/use-restaurants/use-restaurants.hook";

export { useApiRestaurants } from "@/hooks/use-api-restaurants/use-api-restaurants.hook";

export type { UseApiRestaurantsReturn } from "@/hooks/use-api-restaurants/use-api-restaurants.hook";

export { useRestaurantHours, buildDefaultOpeningHours } from "@/hooks/use-restaurant-hours/use-restaurant-hours.hook";

export type { UseRestaurantHoursReturn } from "@/hooks/use-restaurant-hours/use-restaurant-hours.hook";

export { useRestaurantTables } from "@/hooks/use-restaurant-tables/use-restaurant-tables.hook";

export type { UseRestaurantTablesReturn } from "@/hooks/use-restaurant-tables/use-restaurant-tables.hook";

export { restaurantHoursApi } from "@/services/api/restaurant-hours-api/restaurant-hours-api.service";

export { restaurantTablesApi } from "@/services/api/restaurant-tables-api/restaurant-tables-api.service";

export { clientsApi } from "@/services/api/clients-api/clients-api.service";

export { dishesApi } from "@/services/api/dishes-api/dishes-api.service";

export { menusApi } from "@/services/api/menus-api/menus-api.service";

export { ordersApi } from "@/services/api/orders-api/orders-api.service";

export {
  useClients,
  useClientsMulti,
  useCreateClient,
  useUpdateClient,
  useDeleteClient
} from "@/hooks/use-clients/use-clients.hook";

export {
  useDishes,
  useDishesMulti,
  useCreateDish,
  useUpdateDish,
  useDeleteDish
} from "@/hooks/use-dishes/use-dishes.hook";

export {
  useMenus,
  useMenusMulti,
  useCreateMenu,
  useUpdateMenu,
  useDeleteMenu
} from "@/hooks/use-menus/use-menus.hook";

export {
  useOrders,
  useOrdersMulti,
  useCreateOrder,
  useUpdateOrderStatus,
  useUpdateOrderStatusForAny,
  useDeleteOrder
} from "@/hooks/use-orders/use-orders.hook";

export { useRestaurantSelectionStore } from "@/stores/restaurant-selection/restaurant-selection.store";

export { RESTAURANT_MODELS, DEFAULT_MODEL_ID, findModelById } from "@/lib/restaurant-visuals/restaurant-models.constant";

export type { RestaurantModelDef } from "@/lib/restaurant-visuals/restaurant-models.constant";

export type {
  ApiClient,
  ApiDish,
  ApiMenu,
  ApiOpeningHour,
  ApiOrder,
  ApiOrderItem,
  ApiOrderStatus,
  ApiOrganization,
  ApiPaginated,
  ApiRestaurant,
  ApiRestaurantTable,
  ApiTableStatus,
  ApiTableZone,
  ApiUser,
  BulkGenerateTablesInput,
  CreateClientInput,
  CreateDishInput,
  CreateMenuInput,
  CreateOrderInput,
  CreateRestaurantInput,
  CreateTableInput,
  ListOrdersQuery,
  ListTablesQuery,
  UpdateClientInput,
  UpdateDishInput,
  UpdateMenuInput,
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
