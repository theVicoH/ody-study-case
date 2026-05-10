import { RestaurantId, RestaurantNotFoundError } from "@workspace/domain";

import type { RestaurantResponseDTO } from "@/dtos/restaurant/restaurant-response.dto";
import type { UpdateRestaurantSettingsDTO } from "@/dtos/restaurant/update-restaurant-settings.dto";
import type { IRestaurantRepository, RestaurantSettingsProps } from "@workspace/domain";

import { RestaurantMapper } from "@/mappers/restaurant/restaurant.mapper";

export class UpdateRestaurantSettingsUseCase {
  constructor(private readonly restaurantRepository: IRestaurantRepository) {}

  async execute(dto: UpdateRestaurantSettingsDTO): Promise<RestaurantResponseDTO> {
    const id = RestaurantId.create(dto.id);
    const restaurant = await this.restaurantRepository.findById(id);

    if (!restaurant) {
      throw new RestaurantNotFoundError(dto.id);
    }

    const patch: Partial<RestaurantSettingsProps> = {};

    if (dto.address !== undefined) patch.address = dto.address;
    if (dto.phone !== undefined) patch.phone = dto.phone;
    if (dto.maxCovers !== undefined) patch.maxCovers = dto.maxCovers;
    if (dto.tableService !== undefined) patch.tableService = dto.tableService;
    if (dto.clickAndCollect !== undefined) patch.clickAndCollect = dto.clickAndCollect;
    if (dto.kitchenNotifications !== undefined) patch.kitchenNotifications = dto.kitchenNotifications;
    if (dto.testMode !== undefined) patch.testMode = dto.testMode;

    const updated = restaurant.updateSettings(restaurant.settings.with(patch));

    await this.restaurantRepository.save(updated);

    return RestaurantMapper.toResponseDTO(updated);
  }
}
