import {
  CreateOrganizationUseCase,
  CreateRestaurantUseCase,
  CreateUserUseCase,
  DeleteRestaurantUseCase,
  GetOrCreateDemoUserUseCase,
  GetOrganizationUseCase,
  GetRestaurantUseCase,
  GetUserByEmailUseCase,
  GetUserUseCase,
  ListOrganizationsUseCase,
  ListRestaurantsUseCase,
  ListUsersUseCase,
  UpdateOrganizationUseCase,
  UpdateRestaurantSettingsUseCase,
  UpdateRestaurantUseCase,
  UpdateUserUseCase
} from "@workspace/application";
import { db } from "@workspace/database";

import { DrizzleOrganizationRepository } from "@/infrastructure/repositories/organization/drizzle-organization.repository";
import { DrizzleRestaurantRepository } from "@/infrastructure/repositories/restaurant/drizzle-restaurant.repository";
import { DrizzleUserRepository } from "@/infrastructure/repositories/user/drizzle-user.repository";

const userRepository = new DrizzleUserRepository(db);
const organizationRepository = new DrizzleOrganizationRepository(db);
const restaurantRepository = new DrizzleRestaurantRepository(db);

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
  }
} as const;
