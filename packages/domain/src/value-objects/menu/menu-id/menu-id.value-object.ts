import { randomUUID } from "crypto";

import { MenuInvalidIdError } from "@/errors/menu/menu-invalid-id/menu-invalid-id.error";

export class MenuId {
  private constructor(private readonly value: string) {}

  static create(value: string): MenuId {
    const trimmed = value?.trim() ?? "";

    if (!trimmed) {
      throw new MenuInvalidIdError(value);
    }

    return new MenuId(trimmed);
  }

  static generate(): MenuId {
    return new MenuId(randomUUID());
  }

  toString(): string {
    return this.value;
  }
}
