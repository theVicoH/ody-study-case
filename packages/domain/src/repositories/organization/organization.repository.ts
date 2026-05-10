import type { Organization } from "@/entities/organization/organization.entity";
import type { PaginationParams } from "@/types/pagination/pagination-params.type";
import type { PaginatedResult } from "@/types/pagination/pagination-result.type";
import type { OrganizationId } from "@/value-objects/organization/organization-id/organization-id.value-object";
import type { UserId } from "@/value-objects/user/user-id/user-id.value-object";

export interface IOrganizationRepository {
  findById(id: OrganizationId): Promise<Organization | null>;
  findByName(name: string): Promise<Organization | null>;
  findByOwner(ownerId: UserId, params: PaginationParams): Promise<PaginatedResult<Organization>>;
  save(organization: Organization): Promise<void>;
  findAll(params: PaginationParams): Promise<PaginatedResult<Organization>>;
}
