import { Organization, OrganizationName, UserId } from "@workspace/domain";
import { beforeEach, describe, expect, test } from "vitest";

import { FakeOrganizationRepository } from "@/fakes/organization/organization.fake";
import { ListOrganizationsUseCase } from "@/use-cases/organization/list-organizations/list-organizations.use-case";

describe("ListOrganizationsUseCase", () => {
  let repo: FakeOrganizationRepository;
  let useCase: ListOrganizationsUseCase;
  const owner = UserId.generate();
  const otherOwner = UserId.generate();

  beforeEach(async () => {
    repo = new FakeOrganizationRepository();
    useCase = new ListOrganizationsUseCase(repo);
    await repo.save(Organization.create(OrganizationName.create("Acme"), owner));
    await repo.save(Organization.create(OrganizationName.create("Globex"), owner));
    await repo.save(Organization.create(OrganizationName.create("Initech"), otherOwner));
  });

  test("lists all", async () => {
    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.data).toHaveLength(3);
    expect(result.total).toBe(3);
  });

  test("filters by owner", async () => {
    const result = await useCase.execute({ page: 1, limit: 10, ownerId: owner.toString() });

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  test("paginates", async () => {
    const result = await useCase.execute({ page: 1, limit: 2 });

    expect(result.data).toHaveLength(2);
    expect(result.totalPages).toBe(2);
  });
});
