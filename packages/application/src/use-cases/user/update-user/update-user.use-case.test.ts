import { User, UserEmail, UserInvalidEmailError, UserNotFoundError } from "@workspace/domain";
import { describe, test, expect, beforeEach } from "vitest";

import { FakeUserRepository } from "@/fakes/user/user.fake";
import { UpdateUserUseCase } from "@/use-cases/user/update-user/update-user.use-case";

const birthday = new Date("2025-02-25");

describe("UpdateUserUseCase", () => {
  let repo: FakeUserRepository;
  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    repo = new FakeUserRepository();
    useCase = new UpdateUserUseCase(repo);
  });

  test("throws UserNotFoundError if user does not exist", async () => {
    await expect(useCase.execute({ id: "non-existent-id", firstName: "John" })).rejects.toThrow(UserNotFoundError);
  });

  test("updates firstName", async () => {
    const user = User.create(UserEmail.create("john@example.com"), "John", "Doe", birthday);

    await repo.save(user);

    const result = await useCase.execute({ id: user.id.toString(), firstName: "Jane" });

    expect(result.firstName).toBe("Jane");
    expect(result.lastName).toBe("Doe");
    expect(result.email).toBe("john@example.com");
  });

  test("updates email", async () => {
    const user = User.create(UserEmail.create("john@example.com"), "John", "Doe", birthday);

    await repo.save(user);

    const result = await useCase.execute({ id: user.id.toString(), email: "new@example.com" });

    expect(result.email).toBe("new@example.com");
  });

  test("throws UserInvalidEmailError on invalid email", async () => {
    const user = User.create(UserEmail.create("john@example.com"), "John", "Doe", birthday);

    await repo.save(user);

    await expect(useCase.execute({ id: user.id.toString(), email: "not-an-email" })).rejects.toThrow(UserInvalidEmailError);
  });

  test("updates image", async () => {
    const user = User.create(UserEmail.create("john@example.com"), "John", "Doe", birthday);

    await repo.save(user);

    const result = await useCase.execute({ id: user.id.toString(), image: "https://example.com/avatar.png" });

    expect(result.image).toBe("https://example.com/avatar.png");
  });

  test("sets image to null", async () => {
    const user = User.create(UserEmail.create("john@example.com"), "John", "Doe", birthday);

    await repo.save(user);
    await useCase.execute({ id: user.id.toString(), image: "https://example.com/avatar.png" });

    const result = await useCase.execute({ id: user.id.toString(), image: null });

    expect(result.image).toBeNull();
  });

  test("persists changes in repository", async () => {
    const user = User.create(UserEmail.create("john@example.com"), "John", "Doe", birthday);

    await repo.save(user);
    await useCase.execute({ id: user.id.toString(), firstName: "Updated" });

    const saved = await repo.findById(user.id);

    expect(saved?.firstName).toBe("Updated");
  });

  test("no-op when no fields provided", async () => {
    const user = User.create(UserEmail.create("john@example.com"), "John", "Doe", birthday);

    await repo.save(user);

    const result = await useCase.execute({ id: user.id.toString() });

    expect(result.firstName).toBe("John");
    expect(result.updatedAt).toEqual(user.updatedAt);
  });
});
