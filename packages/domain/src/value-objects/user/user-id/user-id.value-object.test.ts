import { describe, test, expect } from "vitest";

import { UserId } from "./user-id.value-object";

import { UserInvalidIdError } from "@/errors/user/user-invalid-id/user-invalid-id.error";

describe("UserId", () => {
  test("throw UserInvalidIdError if empty string", () => {
    expect(() => UserId.create("")).toThrow(UserInvalidIdError);
  });

  test("throw UserInvalidIdError with white space string", () => {
    expect(() => UserId.create("   ")).toThrow(UserInvalidIdError);
  });

  test("trims leading and trailing spaces", () => {
    const id = UserId.create("  550e8400-e29b-41d4-a716-446655440000  ");

    expect(id.toString()).toBe("550e8400-e29b-41d4-a716-446655440000");
  });

  test("should create a UUID", () => {
    const id = UserId.create("550e8400-e29b-41d4-a716-446655440000");

    expect(id.toString()).toBe("550e8400-e29b-41d4-a716-446655440000");
  });


  test("generates a unique id", () => {
    const a = UserId.generate();
    const b = UserId.generate();

    expect(a.toString()).not.toBe(b.toString());
  });

  test("should accept nanoid format id", () => {
    expect(() => UserId.create("V1StGXR8_Z5jdHi6B-myT")).not.toThrow();
  });

  test("should accept number format id", () => {
    expect(() => UserId.create("1234567890")).not.toThrow();
  });
});
