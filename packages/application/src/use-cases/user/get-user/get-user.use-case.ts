import { UserId, UserNotFoundError } from "@workspace/domain";

import type { GetUserDTO } from "@/dtos/user/get-user.dto";
import type { UserResponseDTO } from "@/dtos/user/user-response.dto";
import type { IUserRepository } from "@workspace/domain";

import { UserMapper } from "@/mappers/user/user.mapper";

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: GetUserDTO): Promise<UserResponseDTO> {
    const id = UserId.create(dto.id);
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError(dto.id);
    }

    return UserMapper.toResponseDTO(user);
  }
}
