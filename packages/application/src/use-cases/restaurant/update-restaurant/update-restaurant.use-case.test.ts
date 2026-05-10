import { OrganizationId, Restaurant, RestaurantId, RestaurantInvalidNameError, RestaurantName, RestaurantNotFoundError, RestaurantSettings } from "@workspace/domain";
import { beforeEach, describe, expect, test } from "vitest";

import { FakeRestaurantRepository } from "@/fakes/restaurant/restaurant.fake";
import { UpdateRestaurantUseCase } from "@/use-cases/restaurant/update-restaurant/update-restaurant.use-case";

const settings = RestaurantSettings.create({
  address: "1 rue de la Paix",
  phone: "+33 1 23 45 67 89",
  maxCovers: 80,
  tableService: true,
  clickAndCollect: true,
  kitchenNotifications: true,
  testMode: false
});

describe("UpdateRestaurantUseCase", () => {
  let repo: FakeRestaurantRepository;
  let useCase: UpdateRestaurantUseCase;
  let restaurant: Restaurant;

  beforeEach(async () => {
    repo = new FakeRestaurantRepository();
    useCase = new UpdateRestaurantUseCase(repo);
    restaurant = Restaurant.create(OrganizationId.generate(), RestaurantName.create("Old"), settings);
    await repo.save(restaurant);
  });

  test("renames", async () => {
    const result = await useCase.execute({ id: restaurant.id.toString(), name: "New Name" });

    expect(result.name).toBe("New Name");
  });

  test("throws on invalid name", async () => {
    await expect(useCase.execute({ id: restaurant.id.toString(), name: "A" })).rejects.toThrow(RestaurantInvalidNameError);
  });

  test("throws when not found", async () => {
    await expect(useCase.execute({ id: RestaurantId.generate().toString(), name: "x" })).rejects.toThrow(RestaurantNotFoundError);
  });
});
