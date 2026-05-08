import type { User } from "@/entities/user/user.entity";
import type { PaginationParams } from "@/types/pagination/pagination-params.type";
import type { PaginatedResult } from "@/types/pagination/pagination-result.type";
import type { UserId } from "@/value-objects/user/user-id/user-id.value-object";

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  findAll(params: PaginationParams): Promise<PaginatedResult<User>>;
}
