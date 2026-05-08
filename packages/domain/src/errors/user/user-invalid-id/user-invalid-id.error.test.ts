import { describe, test, expect } from "vitest";

import { UserInvalidIdError } from "./user-invalid-id.error";

describe("UserInvalidIdError", () => {
  test("should create an error with correct message and name", () => {
    const error = new UserInvalidIdError("");

    expect(error.message).toBe("Invalid user id: ");
    expect(error.name).toBe("UserInvalidIdError");
    expect(error).toBeInstanceOf(Error);
  });
});
