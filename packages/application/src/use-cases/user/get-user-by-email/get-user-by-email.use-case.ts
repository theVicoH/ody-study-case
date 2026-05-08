import { UserNotFoundError, type IUserRepository } from "@workspace/domain";

import type { GetUserByEmailDTO } from "@/dtos/user/get-user-by-email.dto";
import type { UserResponseDTO } from "@/dtos/user/user-response.dto";

import { UserMapper } from "@/mappers/user/user.mapper";

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: GetUserByEmailDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UserNotFoundError(dto.email);
    }

    return UserMapper.toResponseDTO(user);
  }
}
