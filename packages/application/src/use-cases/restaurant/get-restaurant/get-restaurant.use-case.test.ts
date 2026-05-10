import { OrganizationId, Restaurant, RestaurantId, RestaurantName, RestaurantNotFoundError, RestaurantSettings } from "@workspace/domain";
import { beforeEach, describe, expect, test } from "vitest";

import { FakeRestaurantRepository } from "@/fakes/restaurant/restaurant.fake";
import { GetRestaurantUseCase } from "@/use-cases/restaurant/get-restaurant/get-restaurant.use-case";

const settings = RestaurantSettings.create({
  address: "1 rue de la Paix",
  phone: "+33 1 23 45 67 89",
  maxCovers: 80,
  tableService: true,
  clickAndCollect: true,
  kitchenNotifications: true,
  testMode: false
});

describe("GetRestaurantUseCase", () => {
  let repo: FakeRestaurantRepository;
  let useCase: GetRestaurantUseCase;

  beforeEach(() => {
    repo = new FakeRestaurantRepository();
    useCase = new GetRestaurantUseCase(repo);
  });

  test("returns when present", async () => {
    const r = Restaurant.create(OrganizationId.generate(), RestaurantName.create("Le Gourmet"), settings);

    await repo.save(r);

    const dto = await useCase.execute({ id: r.id.toString() });

    expect(dto.id).toBe(r.id.toString());
  });

  test("throws when not found", async () => {
    await expect(useCase.execute({ id: RestaurantId.generate().toString() })).rejects.toThrow(RestaurantNotFoundError);
  });
});
