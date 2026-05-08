import { describe, it, expect } from "vitest";

import { UserAlreadyExistsError } from "./user-already-exists.error";

describe("UserAlreadyExistsError", () => {
  it("should create an error with the correct message and name", () => {
    const email = "test@example.com";
    const error = new UserAlreadyExistsError(email);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(`User already exists: ${email}`);
    expect(error.name).toBe("UserAlreadyExistsError");
  });
});
