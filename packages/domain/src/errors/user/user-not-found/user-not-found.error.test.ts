import { describe, it, expect } from "vitest";

import { UserNotFoundError } from "./user-not-found.error";

describe("UserNotFoundError", () => {
  it("should create an error with the correct message and name", () => {
    const id = "123";
    const error = new UserNotFoundError(id);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(`User not found: ${id}`);
    expect(error.name).toBe("UserNotFoundError");
  });
});
