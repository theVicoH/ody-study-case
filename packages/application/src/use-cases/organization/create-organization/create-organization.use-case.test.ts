import { OrganizationAlreadyExistsError, OrganizationInvalidNameError, UserId, UserInvalidIdError } from "@workspace/domain";
import { beforeEach, describe, expect, test } from "vitest";

import { FakeOrganizationRepository } from "@/fakes/organization/organization.fake";
import { CreateOrganizationUseCase } from "@/use-cases/organization/create-organization/create-organization.use-case";

const ownerId = UserId.generate().toString();

describe("CreateOrganizationUseCase", () => {
  let repo: FakeOrganizationRepository;
  let useCase: CreateOrganizationUseCase;

  beforeEach(() => {
    repo = new FakeOrganizationRepository();
    useCase = new CreateOrganizationUseCase(repo);
  });

  test("creates with valid input", async () => {
    const result = await useCase.execute({ name: "Acme", ownerId });

    expect(result.name).toBe("Acme");
    expect(result.ownerId).toBe(ownerId);
    expect(result.id).toBeDefined();
  });

  test("persists", async () => {
    await useCase.execute({ name: "Acme", ownerId });

    expect(repo.getAll()).toHaveLength(1);
  });

  test("throws if name already exists", async () => {
    await useCase.execute({ name: "Acme", ownerId });

    await expect(useCase.execute({ name: "Acme", ownerId })).rejects.toThrow(OrganizationAlreadyExistsError);
  });

  test("throws if name is invalid", async () => {
    await expect(useCase.execute({ name: "A", ownerId })).rejects.toThrow(OrganizationInvalidNameError);
  });

  test("throws if ownerId is invalid", async () => {
    await expect(useCase.execute({ name: "Acme", ownerId: "" })).rejects.toThrow(UserInvalidIdError);
  });
});
