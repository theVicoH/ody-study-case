import type { IOrganizationRepository, Organization, OrganizationId, PaginatedResult, PaginationParams, UserId } from "@workspace/domain";

export class FakeOrganizationRepository implements IOrganizationRepository {
  private organizations: Map<string, Organization> = new Map();

  async findById(id: OrganizationId): Promise<Organization | null> {
    return this.organizations.get(id.toString()) ?? null;
  }

  async findByName(name: string): Promise<Organization | null> {
    for (const org of this.organizations.values()) {
      if (org.name.toString() === name) {
        return org;
      }
    }

    return null;
  }

  async findByOwner(ownerId: UserId, params: PaginationParams): Promise<PaginatedResult<Organization>> {
    const all = Array.from(this.organizations.values()).filter((o) => o.ownerId.toString() === ownerId.toString());

    return this.paginate(all, params);
  }

  async save(organization: Organization): Promise<void> {
    this.organizations.set(organization.id.toString(), organization);
  }

  getAll(): Organization[] {
    return Array.from(this.organizations.values());
  }

  async findAll(params: PaginationParams): Promise<PaginatedResult<Organization>> {
    return this.paginate(Array.from(this.organizations.values()), params);
  }

  private paginate(all: Organization[], params: PaginationParams): PaginatedResult<Organization> {
    const total = all.length;
    const offset = (params.page - 1) * params.limit;
    const data = all.slice(offset, offset + params.limit);

    return {
      data,
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit)
    };
  }
}
