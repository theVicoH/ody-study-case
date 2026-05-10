import { randomUUID } from "crypto";

import { ClientInvalidIdError } from "@/errors/client/client-invalid-id/client-invalid-id.error";

export class ClientId {
  private constructor(private readonly value: string) {}

  static create(value: string): ClientId {
    const trimmed = value?.trim() ?? "";

    if (!trimmed) {
      throw new ClientInvalidIdError(value);
    }

    return new ClientId(trimmed);
  }

  static generate(): ClientId {
    return new ClientId(randomUUID());
  }

  toString(): string {
    return this.value;
  }
}
