import { User, UserEmail } from "@workspace/domain";
import { describe, test, expect, beforeEach } from "vitest";

import { FakeUserRepository } from "@/fakes/user/user.fake";
import { ListUsersUseCase } from "@/use-cases/user/list-users/list-users.use-case";

const birthday = new Date("2025-02-25");
const defaultParams = { page: 1, limit: 20 };

describe("ListUsersUseCase", () => {
  let repo: FakeUserRepository;
  let useCase: ListUsersUseCase;

  beforeEach(() => {
    repo = new FakeUserRepository();
    useCase = new ListUsersUseCase(repo);
  });

  test("should return empty result when no users", async () => {
    const result = await useCase.execute(defaultParams);

    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  test("should return all users on first page", async () => {
    await repo.save(User.create(UserEmail.create("test@gmail.com"), "test", "testeur", birthday));
    await repo.save(User.create(UserEmail.create("johndoe@gmail.com"), "john", "doe", birthday));

    const result = await useCase.execute(defaultParams);

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
  });

  test("should paginate correctly", async () => {
    await repo.save(User.create(UserEmail.create("a@gmail.com"), "a", "a", birthday));
    await repo.save(User.create(UserEmail.create("b@gmail.com"), "b", "b", birthday));
    await repo.save(User.create(UserEmail.create("c@gmail.com"), "c", "c", birthday));

    const result = await useCase.execute({ page: 1, limit: 20 });

    expect(result.data).toHaveLength(3);
    expect(result.total).toBe(3);
    expect(result.totalPages).toBe(1);
  });

  test("should return second page", async () => {
    await repo.save(User.create(UserEmail.create("a@gmail.com"), "a", "a", birthday));
    await repo.save(User.create(UserEmail.create("b@gmail.com"), "b", "b", birthday));
    await repo.save(User.create(UserEmail.create("c@gmail.com"), "c", "c", birthday));

    const result = await useCase.execute({ page: 1, limit: 2 });

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(3);
    expect(result.page).toBe(1);
  });
});
