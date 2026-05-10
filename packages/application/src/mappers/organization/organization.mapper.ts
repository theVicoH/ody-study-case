import type { OrganizationResponseDTO } from "@/dtos/organization/organization-response.dto";
import type { Organization } from "@workspace/domain";

export class OrganizationMapper {
  static toResponseDTO(org: Organization): OrganizationResponseDTO {
    return {
      id: org.id.toString(),
      name: org.name.toString(),
      ownerId: org.ownerId.toString(),
      createdAt: org.createdAt,
      updatedAt: org.updatedAt
    };
  }
}
