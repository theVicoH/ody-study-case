import { RestaurantId, RestaurantNotFoundError } from "@workspace/domain";

import type { DeleteRestaurantDTO } from "@/dtos/restaurant/delete-restaurant.dto";
import type { IRestaurantRepository } from "@workspace/domain";

export class DeleteRestaurantUseCase {
  constructor(private readonly restaurantRepository: IRestaurantRepository) {}

  async execute(dto: DeleteRestaurantDTO): Promise<void> {
    const id = RestaurantId.create(dto.id);
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new RestaurantNotFoundError(dto.id);
    }

    await this.restaurantRepository.delete(id);
  }
}
