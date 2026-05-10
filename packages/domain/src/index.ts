export { User } from "@/entities/user/user.entity";

export { UserId } from "@/value-objects/user/user-id/user-id.value-object";

export { UserEmail } from "@/value-objects/user/user-email/user-email.value-object";

export type { IUserRepository } from "@/repositories/user/user.repository";

export { UserAlreadyExistsError } from "@/errors/user/user-already-exists/user-already-exists.error";

export { UserInvalidIdError } from "@/errors/user/user-invalid-id/user-invalid-id.error";

export { UserInvalidEmailError } from "@/errors/user/user-invalid-email/user-invalid-email.error";

export { UserNotFoundError } from "@/errors/user/user-not-found/user-not-found.error";

export { Organization } from "@/entities/organization/organization.entity";

export { OrganizationId } from "@/value-objects/organization/organization-id/organization-id.value-object";

export { OrganizationName } from "@/value-objects/organization/organization-name/organization-name.value-object";

export type { IOrganizationRepository } from "@/repositories/organization/organization.repository";

export { OrganizationInvalidIdError } from "@/errors/organization/organization-invalid-id/organization-invalid-id.error";

export { OrganizationInvalidNameError } from "@/errors/organization/organization-invalid-name/organization-invalid-name.error";

export { OrganizationNotFoundError } from "@/errors/organization/organization-not-found/organization-not-found.error";

export { OrganizationAlreadyExistsError } from "@/errors/organization/organization-already-exists/organization-already-exists.error";

export { Restaurant } from "@/entities/restaurant/restaurant.entity";

export { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";

export { RestaurantName } from "@/value-objects/restaurant/restaurant-name/restaurant-name.value-object";

export { RestaurantSettings } from "@/value-objects/restaurant/restaurant-settings/restaurant-settings.value-object";

export type { RestaurantSettingsProps } from "@/value-objects/restaurant/restaurant-settings/restaurant-settings.value-object";

export type { IRestaurantRepository } from "@/repositories/restaurant/restaurant.repository";

export { RestaurantInvalidIdError } from "@/errors/restaurant/restaurant-invalid-id/restaurant-invalid-id.error";

export { RestaurantInvalidNameError } from "@/errors/restaurant/restaurant-invalid-name/restaurant-invalid-name.error";

export { RestaurantInvalidSettingsError } from "@/errors/restaurant/restaurant-invalid-settings/restaurant-invalid-settings.error";

export { RestaurantNotFoundError } from "@/errors/restaurant/restaurant-not-found/restaurant-not-found.error";

export type { PaginationParams } from "@/types/pagination/pagination-params.type";

export type { PaginatedResult } from "@/types/pagination/pagination-result.type";

export { Money } from "@/value-objects/shared/money/money.value-object";

export { InvalidMoneyError } from "@/errors/shared/invalid-money/invalid-money.error";

export { Client } from "@/entities/client/client.entity";

export type { ClientProps, ClientTag } from "@/entities/client/client.entity";

export { VALID_TAGS as VALID_CLIENT_TAGS } from "@/entities/client/client.entity";

export { ClientId } from "@/value-objects/client/client-id/client-id.value-object";

export type { IClientRepository } from "@/repositories/client/client.repository";

export { ClientInvalidIdError } from "@/errors/client/client-invalid-id/client-invalid-id.error";

export { ClientInvalidDataError } from "@/errors/client/client-invalid-data/client-invalid-data.error";

export { ClientNotFoundError } from "@/errors/client/client-not-found/client-not-found.error";

export { Dish } from "@/entities/dish/dish.entity";

export type { DishProps } from "@/entities/dish/dish.entity";

export { DishId } from "@/value-objects/dish/dish-id/dish-id.value-object";

export type { IDishRepository } from "@/repositories/dish/dish.repository";

export { DishInvalidIdError } from "@/errors/dish/dish-invalid-id/dish-invalid-id.error";

export { DishInvalidDataError } from "@/errors/dish/dish-invalid-data/dish-invalid-data.error";

export { DishNotFoundError } from "@/errors/dish/dish-not-found/dish-not-found.error";

export { Menu } from "@/entities/menu/menu.entity";

export type { MenuProps } from "@/entities/menu/menu.entity";

export { MenuId } from "@/value-objects/menu/menu-id/menu-id.value-object";

export type { IMenuRepository } from "@/repositories/menu/menu.repository";

export { MenuInvalidIdError } from "@/errors/menu/menu-invalid-id/menu-invalid-id.error";

export { MenuInvalidDataError } from "@/errors/menu/menu-invalid-data/menu-invalid-data.error";

export { MenuNotFoundError } from "@/errors/menu/menu-not-found/menu-not-found.error";

export { Order, ORDER_STATUS } from "@/entities/order/order.entity";

export type { OrderProps, OrderStatus } from "@/entities/order/order.entity";

export { OrderItem } from "@/entities/order/order-item.entity";

export type { OrderItemProps, OrderItemRef } from "@/entities/order/order-item.entity";

export { OrderId } from "@/value-objects/order/order-id/order-id.value-object";

export { OrderItemId } from "@/value-objects/order/order-item-id/order-item-id.value-object";

export type { IOrderRepository } from "@/repositories/order/order.repository";

export { OrderInvalidIdError } from "@/errors/order/order-invalid-id/order-invalid-id.error";

export { OrderInvalidDataError } from "@/errors/order/order-invalid-data/order-invalid-data.error";

export { OrderNotFoundError } from "@/errors/order/order-not-found/order-not-found.error";

export { RestaurantStatsSnapshot } from "@/value-objects/restaurant-stats/restaurant-stats/restaurant-stats.value-object";

export type {
  RestaurantStatsSnapshotProps,
  TopItemSnapshot
} from "@/value-objects/restaurant-stats/restaurant-stats/restaurant-stats.value-object";

export { restaurantStatsCalculator } from "@/services/restaurant-stats/restaurant-stats.calculator";

export type {
  RestaurantStatsCalculatorInput,
  StatsOrderInput,
  StatsOrderItemInput
} from "@/services/restaurant-stats/restaurant-stats.calculator";

export type {
  IRestaurantStatsRepository,
  RestaurantStatsRawData
} from "@/repositories/restaurant-stats/restaurant-stats.repository";
