import { OrganizationId, OrganizationInvalidIdError, RestaurantInvalidNameError, RestaurantInvalidSettingsError } from "@workspace/domain";
import { beforeEach, describe, expect, test } from "vitest";

import { FakeRestaurantRepository } from "@/fakes/restaurant/restaurant.fake";
import { CreateRestaurantUseCase } from "@/use-cases/restaurant/create-restaurant/create-restaurant.use-case";

const orgId = OrganizationId.generate().toString();
const validDto = {
  organizationId: orgId,
  name: "Le Gourmet",
  address: "1 rue de la Paix",
  phone: "+33 1 23 45 67 89",
  maxCovers: 80
};

describe("CreateRestaurantUseCase", () => {
  let repo: FakeRestaurantRepository;
  let useCase: CreateRestaurantUseCase;

  beforeEach(() => {
    repo = new FakeRestaurantRepository();
    useCase = new CreateRestaurantUseCase(repo);
  });

  test("creates with valid input and default toggles", async () => {
    const result = await useCase.execute(validDto);

    expect(result.id).toBeDefined();
    expect(result.organizationId).toBe(orgId);
    expect(result.name).toBe("Le Gourmet");
    expect(result.tableService).toBe(true);
    expect(result.clickAndCollect).toBe(false);
    expect(result.kitchenNotifications).toBe(true);
    expect(result.testMode).toBe(false);
  });

  test("respects explicit toggles", async () => {
    const result = await useCase.execute({ ...validDto, tableService: false, clickAndCollect: true, testMode: true });

    expect(result.tableService).toBe(false);
    expect(result.clickAndCollect).toBe(true);
    expect(result.testMode).toBe(true);
  });

  test("persists", async () => {
    await useCase.execute(validDto);
    expect(repo.getAll()).toHaveLength(1);
  });

  test("throws on invalid org id", async () => {
    await expect(useCase.execute({ ...validDto, organizationId: "" })).rejects.toThrow(OrganizationInvalidIdError);
  });

  test("throws on invalid name", async () => {
    await expect(useCase.execute({ ...validDto, name: "A" })).rejects.toThrow(RestaurantInvalidNameError);
  });

  test("throws on invalid settings", async () => {
    await expect(useCase.execute({ ...validDto, maxCovers: 0 })).rejects.toThrow(RestaurantInvalidSettingsError);
  });
});
