import { describe, test, expect } from "vitest";

import { UserEmail } from "./user-email.value-object";

import { UserInvalidEmailError } from "@/errors/user/user-invalid-email/user-invalid-email.error";

describe("UserEmail", () => {
  test("throw UserInvalidEmailError", () => {
    expect(() => UserEmail.create("")).toThrow(UserInvalidEmailError);
  });

  test("trim white space", () => {
    const email = UserEmail.create("  john@example.com  ");

    expect(email.toString()).toBe("john@example.com");
  });

  test("creates a valid UserEmail", () => {
    const email = UserEmail.create("johndoe@gmail.com");

    expect(email.toString()).toBe("johndoe@gmail.com");
  });

  test("normalises to lowercase", () => {
    const email = UserEmail.create("JOHNDOE@gmail.com");

    expect(email.toString()).toBe("johndoe@gmail.com");
  });

  test("throw error", () => {
    expect(() => UserEmail.create("not-an-email")).toThrow(UserInvalidEmailError);
  });
});
