import { Organization, OrganizationName, OrganizationNotFoundError, UserId } from "@workspace/domain";
import { beforeEach, describe, expect, test } from "vitest";

import { FakeOrganizationRepository } from "@/fakes/organization/organization.fake";
import { DeleteOrganizationUseCase } from "@/use-cases/organization/delete-organization/delete-organization.use-case";

describe("DeleteOrganizationUseCase", () => {
  let repo: FakeOrganizationRepository;
  let useCase: DeleteOrganizationUseCase;

  beforeEach(() => {
    repo = new FakeOrganizationRepository();
    useCase = new DeleteOrganizationUseCase(repo);
  });

  test("deletes the org when it exists", async () => {
    const org = Organization.create(OrganizationName.create("Acme"), UserId.generate());

    await repo.save(org);
    await useCase.execute({ id: org.id.toString() });

    expect(await repo.findById(org.id)).toBeNull();
  });

  test("throws when not found", async () => {
    await expect(useCase.execute({ id: UserId.generate().toString() })).rejects.toThrow(OrganizationNotFoundError);
  });
});
