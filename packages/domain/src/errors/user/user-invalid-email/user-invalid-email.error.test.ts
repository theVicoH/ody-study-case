import { describe, it, expect } from "vitest";

import { UserInvalidEmailError } from "./user-invalid-email.error";

describe("UserInvalidEmailError", () => {
  it("should create an error with the correct message and name", () => {
    const email = "invalid-email";
    const error = new UserInvalidEmailError(email);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(`Invalid email: ${email}`);
    expect(error.name).toBe("UserInvalidEmailError");
  });
});
