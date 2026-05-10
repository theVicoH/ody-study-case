import { OrganizationId, Restaurant, RestaurantName, RestaurantSettings } from "@workspace/domain";

import type { CreateRestaurantDTO } from "@/dtos/restaurant/create-restaurant.dto";
import type { RestaurantResponseDTO } from "@/dtos/restaurant/restaurant-response.dto";
import type { IRestaurantRepository } from "@workspace/domain";

import { RestaurantMapper } from "@/mappers/restaurant/restaurant.mapper";

export class CreateRestaurantUseCase {
  constructor(private readonly restaurantRepository: IRestaurantRepository) {}

  async execute(dto: CreateRestaurantDTO): Promise<RestaurantResponseDTO> {
    const organizationId = OrganizationId.create(dto.organizationId);
    const name = RestaurantName.create(dto.name);
    const settings = RestaurantSettings.create({
      address: dto.address,
      phone: dto.phone,
      maxCovers: dto.maxCovers,
      tableService: dto.tableService ?? true,
      clickAndCollect: dto.clickAndCollect ?? false,
      kitchenNotifications: dto.kitchenNotifications ?? true,
      testMode: dto.testMode ?? false
    });
    const restaurant = Restaurant.create(organizationId, name, settings);

    await this.restaurantRepository.save(restaurant);

    return RestaurantMapper.toResponseDTO(restaurant);
  }
}
