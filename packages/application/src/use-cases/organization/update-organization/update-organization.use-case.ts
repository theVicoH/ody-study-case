import { OrganizationId, OrganizationName, OrganizationNotFoundError } from "@workspace/domain";

import type { OrganizationResponseDTO } from "@/dtos/organization/organization-response.dto";
import type { UpdateOrganizationDTO } from "@/dtos/organization/update-organization.dto";
import type { IOrganizationRepository } from "@workspace/domain";

import { OrganizationMapper } from "@/mappers/organization/organization.mapper";

export class UpdateOrganizationUseCase {
  constructor(private readonly organizationRepository: IOrganizationRepository) {}

  async execute(dto: UpdateOrganizationDTO): Promise<OrganizationResponseDTO> {
    const id = OrganizationId.create(dto.id);
    const org = await this.organizationRepository.findById(id);

    if (!org) {
      throw new OrganizationNotFoundError(dto.id);
    }

    const updated = dto.name !== undefined ? org.rename(OrganizationName.create(dto.name)) : org;

    if (updated !== org) {
      await this.organizationRepository.save(updated);
    }

    return OrganizationMapper.toResponseDTO(updated);
  }
}
