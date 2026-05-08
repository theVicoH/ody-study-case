import { User, UserEmail, UserId, UserNotFoundError } from "@workspace/domain";
import { describe, test, expect, beforeEach } from "vitest";

import { FakeUserRepository } from "@/fakes/user/user.fake";
import { GetUserUseCase } from "@/use-cases/user/get-user/get-user.use-case";

const birthday = new Date("2025-02-25");

describe("GetUserUseCase", () => {
  let repo: FakeUserRepository;
  let useCase: GetUserUseCase;

  beforeEach(() => {
    repo = new FakeUserRepository();
    useCase = new GetUserUseCase(repo);
  });

  test("return user exist", async () => {
    const user = User.create(UserEmail.create("johndoe@gmail.com"), "John", "Doe", birthday);

    await repo.save(user);

    const result = await useCase.execute({ id: user.id.toString() });

    expect(result.id).toBe(user.id.toString());
    expect(result.email).toBe("johndoe@gmail.com");
    expect(result.firstName).toBe("John");
    expect(result.birthday.getTime()).toBe(birthday.getTime());
    expect(result.lastName).toBe("Doe");
    
  });

  test("throw UserNotFoundError if user not found", async () => {
    const fakeId = UserId.generate().toString();

    await expect(useCase.execute({ id: fakeId })).rejects.toThrow(UserNotFoundError);
  });
});
