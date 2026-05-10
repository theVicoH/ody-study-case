import { beforeEach, describe, expect, test } from "vitest";

import { FakeUserRepository } from "@/fakes/user/user.fake";
import { GetOrCreateDemoUserUseCase } from "@/use-cases/user/get-or-create-demo-user/get-or-create-demo-user.use-case";

describe("GetOrCreateDemoUserUseCase", () => {
  let repo: FakeUserRepository;
  let useCase: GetOrCreateDemoUserUseCase;

  beforeEach(() => {
    repo = new FakeUserRepository();
    useCase = new GetOrCreateDemoUserUseCase(repo);
  });

  test("creates a demo user the first time", async () => {
    const result = await useCase.execute();

    expect(result.email).toBe("demo@ody.local");
    expect(repo.getAll()).toHaveLength(1);
  });

  test("returns the same demo user on subsequent calls", async () => {
    const first = await useCase.execute();
    const second = await useCase.execute();

    expect(second.id).toBe(first.id);
    expect(repo.getAll()).toHaveLength(1);
  });
});
