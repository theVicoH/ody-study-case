import { User, UserEmail } from "@workspace/domain";

import type { UserResponseDTO } from "@/dtos/user/user-response.dto";
import type { IUserRepository } from "@workspace/domain";

import { UserMapper } from "@/mappers/user/user.mapper";

const DEMO_EMAIL = "demo@ody.local";
const DEMO_FIRST_NAME = "Demo";
const DEMO_LAST_NAME = "User";
const DEMO_BIRTHDAY = new Date("2000-01-01T00:00:00.000Z");

export class GetOrCreateDemoUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserResponseDTO> {
    const existing = await this.userRepository.findByEmail(DEMO_EMAIL);

    if (existing) {
      return UserMapper.toResponseDTO(existing);
    }

    const user = User.create(UserEmail.create(DEMO_EMAIL), DEMO_FIRST_NAME, DEMO_LAST_NAME, DEMO_BIRTHDAY);

    await this.userRepository.save(user);

    return UserMapper.toResponseDTO(user);
  }
}
