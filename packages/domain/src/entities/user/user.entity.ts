import type { UserEmail } from "@/value-objects/user/user-email/user-email.value-object";

import { UserId } from "@/value-objects/user/user-id/user-id.value-object";

export class User {
  private constructor(
    public readonly id: UserId,
    public readonly email: UserEmail,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly birthday: Date,
    public readonly updatedAt: Date,
    public readonly createdAt: Date,
    public readonly emailVerified: boolean,
    public readonly image: string | null
  ) {}

  static create(email: UserEmail, firstName: string, lastName: string, birthday: Date): User {
    const now = new Date();

    return new User(UserId.generate(), email, firstName, lastName, birthday, now, now, false, null);
  }

  static reconstitute(
    id: UserId,
    email: UserEmail,
    firstName: string,
    lastName: string,
    birthday: Date,
    updatedAt: Date,
    createdAt: Date,
    emailVerified: boolean,
    image: string | null
  ): User {
    return new User(id, email, firstName, lastName, birthday, updatedAt, createdAt, emailVerified, image);
  }

  verifyEmail(): User {
    return new User(
      this.id,
      this.email,
      this.firstName,
      this.lastName,
      this.birthday,
      new Date(),
      this.createdAt,
      true,
      this.image
    );
  }

  update(fields: Partial<{ email: UserEmail; firstName: string; lastName: string; birthday: Date; image: string | null }>): User {
    const hasChanged =
      fields.email !== undefined ||
      fields.firstName !== undefined ||
      fields.lastName !== undefined ||
      fields.birthday !== undefined ||
      fields.image !== undefined;

    if (!hasChanged) {
      return this;
    }

    return new User(
      this.id,
      fields.email ?? this.email,
      fields.firstName ?? this.firstName,
      fields.lastName ?? this.lastName,
      fields.birthday ?? this.birthday,
      new Date(),
      this.createdAt,
      this.emailVerified,
      fields.image !== undefined ? fields.image : this.image
    );
  }
}
