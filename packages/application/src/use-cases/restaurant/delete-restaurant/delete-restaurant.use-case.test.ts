import { OrganizationId, Restaurant, RestaurantId, RestaurantName, RestaurantNotFoundError, RestaurantSettings } from "@workspace/domain";
import { beforeEach, describe, expect, test } from "vitest";

import { FakeRestaurantRepository } from "@/fakes/restaurant/restaurant.fake";
import { DeleteRestaurantUseCase } from "@/use-cases/restaurant/delete-restaurant/delete-restaurant.use-case";

const settings = RestaurantSettings.create({
  address: "1 rue de la Paix",
  phone: "+33 1 23 45 67 89",
  maxCovers: 80,
  tableService: true,
  clickAndCollect: true,
  kitchenNotifications: true,
  testMode: false
});

describe("DeleteRestaurantUseCase", () => {
  let repo: FakeRestaurantRepository;
  let useCase: DeleteRestaurantUseCase;
  let restaurant: Restaurant;

  beforeEach(async () => {
    repo = new FakeRestaurantRepository();
    useCase = new DeleteRestaurantUseCase(repo);
    restaurant = Restaurant.create(OrganizationId.generate(), RestaurantName.create("Le Gourmet"), settings);
    await repo.save(restaurant);
  });

  test("deletes", async () => {
    await useCase.execute({ id: restaurant.id.toString() });
    expect(repo.getAll()).toHaveLength(0);
  });

  test("throws when not found", async () => {
    await expect(useCase.execute({ id: RestaurantId.generate().toString() })).rejects.toThrow(RestaurantNotFoundError);
  });
});
