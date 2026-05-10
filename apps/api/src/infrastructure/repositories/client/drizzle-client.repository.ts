import { clientsTable } from "@workspace/database";
import { Client, ClientId, RestaurantId } from "@workspace/domain";
import { count, eq } from "drizzle-orm";

import type { ClientRow, Database } from "@workspace/database";
import type { ClientTag, IClientRepository, PaginatedResult, PaginationParams } from "@workspace/domain";

export class DrizzleClientRepository implements IClientRepository {
  constructor(private readonly db: Database) {}

  async findById(id: ClientId): Promise<Client | null> {
    const [row] = await this.db
      .select()
      .from(clientsTable)
      .where(eq(clientsTable.id, id.toString()))
      .limit(1);

    return row ? this.toEntity(row) : null;
  }

  async findByRestaurant(
    restaurantId: RestaurantId,
    params: PaginationParams
  ): Promise<PaginatedResult<Client>> {
    const offset = (params.page - 1) * params.limit;
    const where = eq(clientsTable.restaurantId, restaurantId.toString());
    const [rows, [{ value: total } = { value: 0 }]] = await Promise.all([
      this.db.select().from(clientsTable).where(where).limit(params.limit).offset(offset),
      this.db.select({ value: count() }).from(clientsTable).where(where)
    ]);
    const totalNum = Number(total);

    return {
      data: rows.map((r) => this.toEntity(r)),
      total: totalNum,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(totalNum / params.limit)
    };
  }

  async save(client: Client): Promise<void> {
    const values = {
      id: client.id.toString(),
      restaurantId: client.restaurantId.toString(),
      firstName: client.props.firstName,
      lastName: client.props.lastName,
      email: client.props.email,
      phone: client.props.phone,
      notes: client.props.notes,
      tag: client.props.tag,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    };

    await this.db
      .insert(clientsTable)
      .values(values)
      .onConflictDoUpdate({
        target: clientsTable.id,
        set: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          notes: values.notes,
          tag: values.tag,
          updatedAt: values.updatedAt
        }
      });
  }

  async delete(id: ClientId): Promise<void> {
    await this.db.delete(clientsTable).where(eq(clientsTable.id, id.toString()));
  }

  private toEntity(row: ClientRow): Client {
    return Client.reconstitute(
      ClientId.create(row.id),
      RestaurantId.create(row.restaurantId),
      {
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        phone: row.phone,
        notes: row.notes,
        tag: row.tag as ClientTag
      },
      row.createdAt,
      row.updatedAt
    );
  }
}
