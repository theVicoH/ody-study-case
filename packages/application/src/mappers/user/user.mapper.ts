import type { UserResponseDTO } from "@/dtos/user/user-response.dto";
import type { User } from "@workspace/domain";


export class UserMapper {
  static toResponseDTO(user: User): UserResponseDTO {
    return {
      id: user.id.toString(),
      email: user.email.toString(),
      emailVerified: user.emailVerified,
      firstName: user.firstName,
      lastName: user.lastName,
      birthday: user.birthday,
      image: user.image,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt
    };
  }
}
