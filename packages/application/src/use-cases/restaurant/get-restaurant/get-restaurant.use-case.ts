import { RestaurantId, RestaurantNotFoundError } from "@workspace/domain";

import type { GetRestaurantDTO } from "@/dtos/restaurant/get-restaurant.dto";
import type { RestaurantResponseDTO } from "@/dtos/restaurant/restaurant-response.dto";
import type { IRestaurantRepository } from "@workspace/domain";

import { RestaurantMapper } from "@/mappers/restaurant/restaurant.mapper";

export class GetRestaurantUseCase {
  constructor(private readonly restaurantRepository: IRestaurantRepository) {}

  async execute(dto: GetRestaurantDTO): Promise<RestaurantResponseDTO> {
    const id = RestaurantId.create(dto.id);
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new RestaurantNotFoundError(dto.id);
    }

    return RestaurantMapper.toResponseDTO(restaurant);
  }
}
