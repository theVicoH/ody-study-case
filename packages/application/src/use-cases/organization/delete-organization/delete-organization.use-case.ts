import { OrganizationId, OrganizationNotFoundError } from "@workspace/domain";

import type { DeleteOrganizationDTO } from "@/dtos/organization/delete-organization.dto";
import type { IOrganizationRepository } from "@workspace/domain";

export class DeleteOrganizationUseCase {
  constructor(private readonly organizationRepository: IOrganizationRepository) {}

  async execute(dto: DeleteOrganizationDTO): Promise<void> {
    const id = OrganizationId.create(dto.id);
    const organization = await this.organizationRepository.findById(id);

    if (!organization) {
      throw new OrganizationNotFoundError(dto.id);
    }

    await this.organizationRepository.delete(id);
  }
}
