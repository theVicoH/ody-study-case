import { UserId } from "@workspace/domain";

import type { ListOrganizationsDTO } from "@/dtos/organization/list-organizations.dto";
import type { PaginatedOrganizationsResponseDTO } from "@/dtos/organization/paginated-organizations-response.dto";
import type { IOrganizationRepository } from "@workspace/domain";

import { OrganizationMapper } from "@/mappers/organization/organization.mapper";

export class ListOrganizationsUseCase {
  constructor(private readonly organizationRepository: IOrganizationRepository) {}

  async execute(dto: ListOrganizationsDTO): Promise<PaginatedOrganizationsResponseDTO> {
    const params = { page: dto.page, limit: dto.limit };
    const result = dto.ownerId
      ? await this.organizationRepository.findByOwner(UserId.create(dto.ownerId), params)
      : await this.organizationRepository.findAll(params);

    return {
      data: result.data.map(OrganizationMapper.toResponseDTO),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }
}
