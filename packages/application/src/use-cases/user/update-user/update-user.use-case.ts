import { UserId, UserEmail, UserNotFoundError } from "@workspace/domain";

import type { UpdateUserDTO } from "@/dtos/user/update-user.dto";
import type { UserResponseDTO } from "@/dtos/user/user-response.dto";
import type { IUserRepository } from "@workspace/domain";

import { UserMapper } from "@/mappers/user/user.mapper";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: UpdateUserDTO): Promise<UserResponseDTO> {
    const id = UserId.create(dto.id);
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError(dto.id);
    }

    const updated = user.update({
      email: dto.email !== undefined ? UserEmail.create(dto.email) : undefined,
      firstName: dto.firstName,
      lastName: dto.lastName,
      image: dto.image
    });

    await this.userRepository.save(updated);

    return UserMapper.toResponseDTO(updated);
  }
}
