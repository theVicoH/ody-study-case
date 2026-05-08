import { User, UserAlreadyExistsError, UserEmail } from "@workspace/domain";

import type { IUserRepository } from "@workspace/domain";
import type { CreateUserDTO } from "@/dtos/user/create-user.dto";
import type { UserResponseDTO } from "@/dtos/user/user-response.dto";

import { UserMapper } from "@/mappers/user/user.mapper";

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    const existing = await this.userRepository.findByEmail(dto.email);

    if (existing) {
      throw new UserAlreadyExistsError(dto.email);
    }

    const email = UserEmail.create(dto.email);
    const user = User.create(email, dto.firstName, dto.lastName, dto.birthday);

    await this.userRepository.save(user);

    return UserMapper.toResponseDTO(user);
  }
}
