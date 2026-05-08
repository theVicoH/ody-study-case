import { User, UserEmail, UserNotFoundError } from "@workspace/domain";
import { describe, test, expect, beforeEach } from "vitest";

import { FakeUserRepository } from "@/fakes/user/user.fake";
import { GetUserByEmailUseCase } from "@/use-cases/user/get-user-by-email/get-user-by-email.use-case";

const birthday = new Date("2025-02-25");

describe("GetUserByEmailUseCase", () => {
  let repo: FakeUserRepository;
  let useCase: GetUserByEmailUseCase;

  beforeEach(() => {
    repo = new FakeUserRepository();
    useCase = new GetUserByEmailUseCase(repo);
  });

  test("returns user when email exists", async () => {
    const user = User.create(UserEmail.create("johndoe@gmail.com"), "John", "Doe", birthday);

    await repo.save(user);

    const result = await useCase.execute({ email: "johndoe@gmail.com" });

    expect(result).not.toBeNull();
    expect(result?.email).toBe("johndoe@gmail.com");
    expect(result?.firstName).toBe("John");
    expect(result?.lastName).toBe("Doe");
  });

  test("throws UserNotFoundError when email does not exist", async () => {
    await expect(useCase.execute({ email: "unknown@gmail.com" })).rejects.toThrow(UserNotFoundError);
  });
});
