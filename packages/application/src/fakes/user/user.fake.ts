import type { IUserRepository, User, UserId, PaginationParams, PaginatedResult } from "@workspace/domain";

export class FakeUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: UserId): Promise<User | null> {
    return this.users.get(id.toString()) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for(const user of this.users.values()) {
      if(user.email.toString() === email) {
        return user;
      }
    }

    return null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id.toString(), user);
  }

  getAll(): User[] {
    return Array.from(this.users.values());
  }

  async findAll(params: PaginationParams): Promise<PaginatedResult<User>> {
    const all = Array.from(this.users.values());
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
