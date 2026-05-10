import { usersTable } from "@workspace/database";
import { User, UserEmail, UserId } from "@workspace/domain";
import { count, eq } from "drizzle-orm";

import type { Database, UserRow } from "@workspace/database";
import type { IUserRepository, PaginatedResult, PaginationParams } from "@workspace/domain";

export class DrizzleUserRepository implements IUserRepository {
  constructor(private readonly db: Database) {}

  async findById(id: UserId): Promise<User | null> {
    const [row] = await this.db.select().from(usersTable).where(eq(usersTable.id, id.toString())).limit(1);

    return row ? this.toEntity(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase().trim();
    const [row] = await this.db.select().from(usersTable).where(eq(usersTable.email, normalized)).limit(1);

    return row ? this.toEntity(row) : null;
  }

  async save(user: User): Promise<void> {
    await this.db
      .insert(usersTable)
      .values({
        id: user.id.toString(),
        email: user.email.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })
      .onConflictDoUpdate({
        target: usersTable.id,
        set: {
          email: user.email.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          birthday: user.birthday,
          emailVerified: user.emailVerified,
          image: user.image,
          updatedAt: user.updatedAt
        }
      });
  }

  async findAll(params: PaginationParams): Promise<PaginatedResult<User>> {
    const offset = (params.page - 1) * params.limit;
    const [rows, [{ value: total } = { value: 0 }]] = await Promise.all([
      this.db.select().from(usersTable).limit(params.limit).offset(offset),
      this.db.select({ value: count() }).from(usersTable)
    ]);

    return {
      data: rows.map((r) => this.toEntity(r)),
      total: Number(total),
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(Number(total) / params.limit)
    };
  }

  private toEntity(row: UserRow): User {
    return User.reconstitute(
      UserId.create(row.id),
      UserEmail.create(row.email),
      row.firstName,
      row.lastName,
      row.birthday,
      row.updatedAt,
      row.createdAt,
      row.emailVerified,
      row.image
    );
  }
}
