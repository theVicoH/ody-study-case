import { UserAlreadyExistsError, UserInvalidEmailError } from "@workspace/domain";
import { describe, test, expect, beforeEach } from "vitest";

import { FakeUserRepository } from "@/fakes/user/user.fake";
import { CreateUserUseCase } from "@/use-cases/user/create-user/create-user.use-case";

const birthday = new Date("2025-02-25");

describe("CreateUserUseCase", () => {
  let repo: FakeUserRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    repo = new FakeUserRepository();
    createUserUseCase = new CreateUserUseCase(repo);
  });

  test("creates a user with valid data", async () => {
    const result = await createUserUseCase.execute({
      email: "johndoe@gmail.com",
      firstName: "John",
      lastName: "Doe",
      birthday
    });

    expect(result.email).toBe("johndoe@gmail.com");
    expect(result.firstName).toBe("John");
    expect(result.lastName).toBe("Doe");
    expect(result.id).toBeDefined();
  });

  test("persists user on repo", async () => {
    await createUserUseCase.execute({ email: "johndoe@gmail.com", firstName: "John", lastName: "Doe", birthday });

    expect(repo.getAll()).toHaveLength(1);
  });

  test("throws UserAlreadyExistsError if email is already taken", async () => {
    await createUserUseCase.execute({ email: "johndoe@gmail.com", firstName: "John", lastName: "Doe", birthday });

    await expect(
      createUserUseCase.execute({ email: "johndoe@gmail.com", firstName: "Jane", lastName: "Smith", birthday })
    ).rejects.toThrow(UserAlreadyExistsError);
  });

  test("throws UserInvalidEmailError if email is not valid", async () => {
    await expect(
      createUserUseCase.execute({ email: "not-valid-email", firstName: "John", lastName: "Doe", birthday })
    ).rejects.toThrow(UserInvalidEmailError);
  });
});
