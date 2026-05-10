import { OrganizationId, OrganizationNotFoundError } from "@workspace/domain";

import type { GetOrganizationDTO } from "@/dtos/organization/get-organization.dto";
import type { OrganizationResponseDTO } from "@/dtos/organization/organization-response.dto";
import type { IOrganizationRepository } from "@workspace/domain";

import { OrganizationMapper } from "@/mappers/organization/organization.mapper";

export class GetOrganizationUseCase {
  constructor(private readonly organizationRepository: IOrganizationRepository) {}

  async execute(dto: GetOrganizationDTO): Promise<OrganizationResponseDTO> {
    const id = OrganizationId.create(dto.id);
    const org = await this.organizationRepository.findById(id);

    if (!org) {
      throw new OrganizationNotFoundError(dto.id);
    }

    return OrganizationMapper.toResponseDTO(org);
  }
}
