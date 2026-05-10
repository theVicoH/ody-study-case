import { organizationsTable } from "@workspace/database";
import { Organization, OrganizationId, OrganizationName, UserId } from "@workspace/domain";
import { count, eq } from "drizzle-orm";

import type { Database, OrganizationRow } from "@workspace/database";
import type { IOrganizationRepository, PaginatedResult, PaginationParams } from "@workspace/domain";

export class DrizzleOrganizationRepository implements IOrganizationRepository {
  constructor(private readonly db: Database) {}

  async findById(id: OrganizationId): Promise<Organization | null> {
    const [row] = await this.db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.id, id.toString()))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  async findByName(name: string): Promise<Organization | null> {
    const [row] = await this.db
      .select()
      .from(organizationsTable)
      .where(eq(organizationsTable.name, name))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  async findByOwner(ownerId: UserId, params: PaginationParams): Promise<PaginatedResult<Organization>> {
    const offset = (params.page - 1) * params.limit;
    const where = eq(organizationsTable.ownerId, ownerId.toString());
    const [rows, [{ value: total } = { value: 0 }]] = await Promise.all([
      this.db.select().from(organizationsTable).where(where).limit(params.limit).offset(offset),
      this.db.select({ value: count() }).from(organizationsTable).where(where)
    ]);

    return {
      data: rows.map((r) => this.toEntity(r)),
      total: Number(total),
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(Number(total) / params.limit)
    };
  }

  async save(org: Organization): Promise<void> {
    await this.db
      .insert(organizationsTable)
      .values({
        id: org.id.toString(),
        name: org.name.toString(),
        ownerId: org.ownerId.toString(),
        createdAt: org.createdAt,
        updatedAt: org.updatedAt
      })
      .onConflictDoUpdate({
        target: organizationsTable.id,
        set: {
          name: org.name.toString(),
          updatedAt: org.updatedAt
        }
      });
  }

  async findAll(params: PaginationParams): Promise<PaginatedResult<Organization>> {
    const offset = (params.page - 1) * params.limit;
    const [rows, [{ value: total } = { value: 0 }]] = await Promise.all([
      this.db.select().from(organizationsTable).limit(params.limit).offset(offset),
      this.db.select({ value: count() }).from(organizationsTable)
    ]);

    return {
      data: rows.map((r) => this.toEntity(r)),
      total: Number(total),
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(Number(total) / params.limit)
    };
  }

  private toEntity(row: OrganizationRow): Organization {
    return Organization.reconstitute(
      OrganizationId.create(row.id),
      OrganizationName.create(row.name),
      UserId.create(row.ownerId),
      row.updatedAt,
      row.createdAt
    );
  }
}
