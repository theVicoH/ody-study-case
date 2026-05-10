import { Organization, OrganizationAlreadyExistsError, OrganizationName, UserId } from "@workspace/domain";

import type { CreateOrganizationDTO } from "@/dtos/organization/create-organization.dto";
import type { OrganizationResponseDTO } from "@/dtos/organization/organization-response.dto";
import type { IOrganizationRepository } from "@workspace/domain";

import { OrganizationMapper } from "@/mappers/organization/organization.mapper";

export class CreateOrganizationUseCase {
  constructor(private readonly organizationRepository: IOrganizationRepository) {}

  async execute(dto: CreateOrganizationDTO): Promise<OrganizationResponseDTO> {
    const existing = await this.organizationRepository.findByName(dto.name);

    if (existing) {
      throw new OrganizationAlreadyExistsError(dto.name);
    }

    const ownerId = UserId.create(dto.ownerId);
    const name = OrganizationName.create(dto.name);
    const org = Organization.create(name, ownerId);

    await this.organizationRepository.save(org);

    return OrganizationMapper.toResponseDTO(org);
  }
}
