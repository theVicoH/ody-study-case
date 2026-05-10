import { RestaurantId, RestaurantName, RestaurantNotFoundError } from "@workspace/domain";

import type { RestaurantResponseDTO } from "@/dtos/restaurant/restaurant-response.dto";
import type { UpdateRestaurantDTO } from "@/dtos/restaurant/update-restaurant.dto";
import type { IRestaurantRepository } from "@workspace/domain";

import { RestaurantMapper } from "@/mappers/restaurant/restaurant.mapper";

export class UpdateRestaurantUseCase {
  constructor(private readonly restaurantRepository: IRestaurantRepository) {}

  async execute(dto: UpdateRestaurantDTO): Promise<RestaurantResponseDTO> {
    const id = RestaurantId.create(dto.id);
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new RestaurantNotFoundError(dto.id);
    }

    const updated = dto.name !== undefined ? restaurant.rename(RestaurantName.create(dto.name)) : restaurant;

    if (updated !== restaurant) {
      await this.restaurantRepository.save(updated);
    }

    return RestaurantMapper.toResponseDTO(updated);
  }
}
