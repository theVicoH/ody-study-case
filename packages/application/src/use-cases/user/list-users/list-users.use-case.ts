
import type { ListUsersDTO } from "@/dtos/user/list-users.dto";
import type { PaginatedUsersResponseDTO } from "@/dtos/user/paginated-users-response.dto";
import type { IUserRepository } from "@workspace/domain";

import { UserMapper } from "@/mappers/user/user.mapper";

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: ListUsersDTO): Promise<PaginatedUsersResponseDTO> {
    const result = await this.userRepository.findAll({ page: dto.page, limit: dto.limit });

    return {
      data: result.data.map(UserMapper.toResponseDTO),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }
}
