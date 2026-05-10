import { Organization, OrganizationName, OrganizationNotFoundError, UserId } from "@workspace/domain";
import { beforeEach, describe, expect, test } from "vitest";

import { FakeOrganizationRepository } from "@/fakes/organization/organization.fake";
import { GetOrganizationUseCase } from "@/use-cases/organization/get-organization/get-organization.use-case";

describe("GetOrganizationUseCase", () => {
  let repo: FakeOrganizationRepository;
  let useCase: GetOrganizationUseCase;

  beforeEach(() => {
    repo = new FakeOrganizationRepository();
    useCase = new GetOrganizationUseCase(repo);
  });

  test("returns the org when it exists", async () => {
    const org = Organization.create(OrganizationName.create("Acme"), UserId.generate());

    await repo.save(org);

    const result = await useCase.execute({ id: org.id.toString() });

    expect(result.id).toBe(org.id.toString());
  });

  test("throws when not found", async () => {
    await expect(useCase.execute({ id: UserId.generate().toString() })).rejects.toThrow(OrganizationNotFoundError);
  });
});
