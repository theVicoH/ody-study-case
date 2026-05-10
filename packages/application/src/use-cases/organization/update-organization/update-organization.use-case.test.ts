import { Organization, OrganizationInvalidNameError, OrganizationName, OrganizationNotFoundError, UserId } from "@workspace/domain";
import { beforeEach, describe, expect, test } from "vitest";

import { FakeOrganizationRepository } from "@/fakes/organization/organization.fake";
import { UpdateOrganizationUseCase } from "@/use-cases/organization/update-organization/update-organization.use-case";

describe("UpdateOrganizationUseCase", () => {
  let repo: FakeOrganizationRepository;
  let useCase: UpdateOrganizationUseCase;
  let org: Organization;

  beforeEach(async () => {
    repo = new FakeOrganizationRepository();
    useCase = new UpdateOrganizationUseCase(repo);
    org = Organization.create(OrganizationName.create("Acme"), UserId.generate());
    await repo.save(org);
  });

  test("renames", async () => {
    const result = await useCase.execute({ id: org.id.toString(), name: "Globex" });

    expect(result.name).toBe("Globex");
  });

  test("throws on invalid name", async () => {
    await expect(useCase.execute({ id: org.id.toString(), name: "A" })).rejects.toThrow(OrganizationInvalidNameError);
  });

  test("throws when not found", async () => {
    await expect(useCase.execute({ id: UserId.generate().toString(), name: "Foo" })).rejects.toThrow(OrganizationNotFoundError);
  });
});
