import { describe, test, expect } from "vitest";

import { User } from "@/entities/user/user.entity";
import { UserEmail } from "@/value-objects/user/user-email/user-email.value-object";

const birthday = new Date("2025-02-25"); 
const user = User.create(UserEmail.create("johndoe@gmail.com"), "john", "doe", birthday);

describe("User", () => {
  test("should create an user", () => {
    expect(user.id.toString()).toBeDefined();
    expect(user.email.toString()).toBe("johndoe@gmail.com");
    expect(user.firstName).toBe("john");
    expect(user.lastName).toBe("doe");
    expect(user.birthday.getTime()).toBe(birthday.getTime());
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  test("should update have updatedAt equal to createdAt on creation", () => {
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user.updatedAt.getTime()).toBe(user.createdAt.getTime());
  });

  test("should not update with empty object", () => {
    const updated = user.update({});

    expect(updated.firstName).toBe("john");
    expect(updated.createdAt).toBe(user.createdAt);
    expect(updated.updatedAt).toBe(user.updatedAt);
  });

  test("should update user firstName", () => {
    const updated = user.update({ firstName: "alice" });

    expect(updated.firstName).toBe("alice");
    expect(updated.email.toString()).toBe("johndoe@gmail.com");
    expect(updated.createdAt).toBe(user.createdAt);
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(user.updatedAt.getTime());
  });

  test("should update user email", () => {
    const updated = user.update({ email: UserEmail.create("alice@gmail.com")});

    expect(updated.firstName).toBe("john");
    expect(updated.email.toString()).toBe("alice@gmail.com");
    expect(updated.createdAt).toBe(user.createdAt);
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(user.updatedAt.getTime());
  });

  test("should update birthday", () => {
    const updatedBirthday = new Date("2025-03-25");
    const updated = user.update({ birthday: updatedBirthday});

    expect(updated.firstName).toBe("john");
    expect(updated.email.toString()).toBe("johndoe@gmail.com");
    expect(updated.birthday.getTime()).toBe(updatedBirthday.getTime());
    expect(updated.createdAt).toBe(user.createdAt);
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(user.updatedAt.getTime());
  });

  test("should have emailVerified false by default on creation", () => {
    expect(user.emailVerified).toBe(false);
  });

  test("should verify email and return new User with emailVerified true", () => {
    const verified = user.verifyEmail();

    expect(verified.emailVerified).toBe(true);
  });

  test("should update updatedAt when verifying email", () => {
    const verified = user.verifyEmail();

    expect(verified.updatedAt.getTime()).toBeGreaterThanOrEqual(user.updatedAt.getTime());
  });

  test("should keep all other fields unchanged when verifying email", () => {
    const verified = user.verifyEmail();

    expect(verified.id).toBe(user.id);
    expect(verified.email).toBe(user.email);
    expect(verified.firstName).toBe(user.firstName);
    expect(verified.lastName).toBe(user.lastName);
    expect(verified.createdAt).toBe(user.createdAt);
  });

  test("should not change emailVerified when calling update", () => {
    const updated = user.update({ firstName: "alice" });

    expect(updated.emailVerified).toBe(false);
  });

  test("should have image null by default on creation", () => {
    expect(user.image).toBeNull();
  });

  test("should update image", () => {
    const updated = user.update({ image: "https://example.com/avatar.png" });

    expect(updated.image).toBe("https://example.com/avatar.png");
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(user.updatedAt.getTime());
  });

  test("should not update if no fields provided", () => {
    const updated = user.update({});

    expect(updated.image).toBeNull();
    expect(updated.updatedAt).toBe(user.updatedAt);
  });

  test("should keep image unchanged when not provided in update", () => {
    const withImage = user.update({ image: "https://example.com/avatar.png" });
    const updated = withImage.update({ firstName: "jane" });

    expect(updated.image).toBe("https://example.com/avatar.png");
  });
});
