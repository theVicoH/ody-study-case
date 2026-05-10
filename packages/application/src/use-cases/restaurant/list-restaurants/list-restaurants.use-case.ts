import { OrganizationId } from "@workspace/domain";

import type { ListRestaurantsDTO } from "@/dtos/restaurant/list-restaurants.dto";
import type { PaginatedRestaurantsResponseDTO } from "@/dtos/restaurant/paginated-restaurants-response.dto";
import type { IRestaurantRepository } from "@workspace/domain";

import { RestaurantMapper } from "@/mappers/restaurant/restaurant.mapper";

export class ListRestaurantsUseCase {
  constructor(private readonly restaurantRepository: IRestaurantRepository) {}

  async execute(dto: ListRestaurantsDTO): Promise<PaginatedRestaurantsResponseDTO> {
    const params = { page: dto.page, limit: dto.limit };
    const result = dto.organizationId
      ? await this.restaurantRepository.findByOrganization(OrganizationId.create(dto.organizationId), params)
      : await this.restaurantRepository.findAll(params);

    return {
      data: result.data.map(RestaurantMapper.toResponseDTO),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }
}
