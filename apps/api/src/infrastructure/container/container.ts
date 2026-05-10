import {
  CreateClientUseCase,
  CreateDishUseCase,
  CreateMenuUseCase,
  CreateOrderUseCase,
  CreateOrganizationUseCase,
  CreateRestaurantUseCase,
  CreateUserUseCase,
  DeleteClientUseCase,
  DeleteDishUseCase,
  DeleteMenuUseCase,
  DeleteOrderUseCase,
  DeleteRestaurantUseCase,
  GetClientUseCase,
  GetDishUseCase,
  GetMenuUseCase,
  GetOrCreateDemoUserUseCase,
  GetOrderUseCase,
  GetOrganizationUseCase,
  GetRestaurantUseCase,
  GetUserByEmailUseCase,
  GetUserUseCase,
  ListClientsUseCase,
  ListDishesUseCase,
  ListMenusUseCase,
  ListOrdersUseCase,
  ListOrganizationsUseCase,
  ListRestaurantsUseCase,
  ListUsersUseCase,
  UpdateClientUseCase,
  UpdateDishUseCase,
  UpdateMenuUseCase,
  UpdateOrderStatusUseCase,
  UpdateOrganizationUseCase,
  UpdateRestaurantSettingsUseCase,
  UpdateRestaurantUseCase,
  UpdateUserUseCase
} from "@workspace/application";
import { db } from "@workspace/database";

import { DrizzleClientRepository } from "@/infrastructure/repositories/client/drizzle-client.repository";
import { DrizzleDishRepository } from "@/infrastructure/repositories/dish/drizzle-dish.repository";
import { DrizzleMenuRepository } from "@/infrastructure/repositories/menu/drizzle-menu.repository";
import { DrizzleOrderRepository } from "@/infrastructure/repositories/order/drizzle-order.repository";
import { DrizzleOrganizationRepository } from "@/infrastructure/repositories/organization/drizzle-organization.repository";
import { DrizzleRestaurantRepository } from "@/infrastructure/repositories/restaurant/drizzle-restaurant.repository";
import { DrizzleUserRepository } from "@/infrastructure/repositories/user/drizzle-user.repository";

const userRepository = new DrizzleUserRepository(db);
const organizationRepository = new DrizzleOrganizationRepository(db);
const restaurantRepository = new DrizzleRestaurantRepository(db);
const clientRepository = new DrizzleClientRepository(db);
const dishRepository = new DrizzleDishRepository(db);
const menuRepository = new DrizzleMenuRepository(db);
const orderRepository = new DrizzleOrderRepository(db);

export const container = {
  user: {
    create: new CreateUserUseCase(userRepository),
    get: new GetUserUseCase(userRepository),
    getByEmail: new GetUserByEmailUseCase(userRepository),
    list: new ListUsersUseCase(userRepository),
    update: new UpdateUserUseCase(userRepository),
    getOrCreateDemo: new GetOrCreateDemoUserUseCase(userRepository)
  },
  organization: {
    create: new CreateOrganizationUseCase(organizationRepository),
    get: new GetOrganizationUseCase(organizationRepository),
    list: new ListOrganizationsUseCase(organizationRepository),
    update: new UpdateOrganizationUseCase(organizationRepository)
  },
  restaurant: {
    create: new CreateRestaurantUseCase(restaurantRepository),
    get: new GetRestaurantUseCase(restaurantRepository),
    list: new ListRestaurantsUseCase(restaurantRepository),
    update: new UpdateRestaurantUseCase(restaurantRepository),
    updateSettings: new UpdateRestaurantSettingsUseCase(restaurantRepository),
    delete: new DeleteRestaurantUseCase(restaurantRepository)
  },
  client: {
    create: new CreateClientUseCase(clientRepository),
    get: new GetClientUseCase(clientRepository),
    list: new ListClientsUseCase(clientRepository),
    update: new UpdateClientUseCase(clientRepository),
    delete: new DeleteClientUseCase(clientRepository)
  },
  dish: {
    create: new CreateDishUseCase(dishRepository),
    get: new GetDishUseCase(dishRepository),
    list: new ListDishesUseCase(dishRepository),
    update: new UpdateDishUseCase(dishRepository),
    delete: new DeleteDishUseCase(dishRepository)
  },
  menu: {
    create: new CreateMenuUseCase(menuRepository),
    get: new GetMenuUseCase(menuRepository),
    list: new ListMenusUseCase(menuRepository),
    update: new UpdateMenuUseCase(menuRepository),
    delete: new DeleteMenuUseCase(menuRepository)
  },
  order: {
    create: new CreateOrderUseCase(orderRepository, dishRepository, menuRepository),
    get: new GetOrderUseCase(orderRepository),
    list: new ListOrdersUseCase(orderRepository),
    updateStatus: new UpdateOrderStatusUseCase(orderRepository),
    delete: new DeleteOrderUseCase(orderRepository)
  }
} as const;
