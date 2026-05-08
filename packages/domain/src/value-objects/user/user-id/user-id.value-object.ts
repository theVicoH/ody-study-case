import { randomUUID } from "crypto";

import { UserInvalidIdError } from "@/errors/user/user-invalid-id/user-invalid-id.error";

export class UserId {
  private constructor(private readonly value: string) {}

  static create(value: string): UserId {
    const trimmed = value?.trim() ?? "";

    if (!trimmed) {
      throw new UserInvalidIdError(value);
    }

    return new UserId(trimmed);
  }

  static generate(): UserId {
    return new UserId(randomUUID());
  }

  toString(): string {
    return this.value;
  }
}
