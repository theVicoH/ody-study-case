import { OrganizationId, Restaurant, RestaurantId, RestaurantInvalidSettingsError, RestaurantName, RestaurantNotFoundError, RestaurantSettings } from "@workspace/domain";
import { beforeEach, describe, expect, test } from "vitest";

import { FakeRestaurantRepository } from "@/fakes/restaurant/restaurant.fake";
import { UpdateRestaurantSettingsUseCase } from "@/use-cases/restaurant/update-restaurant-settings/update-restaurant-settings.use-case";

const settings = RestaurantSettings.create({
  address: "1 rue de la Paix",
  phone: "+33 1 23 45 67 89",
  maxCovers: 80,
  tableService: true,
  clickAndCollect: true,
  kitchenNotifications: true,
  testMode: false
});

describe("UpdateRestaurantSettingsUseCase", () => {
  let repo: FakeRestaurantRepository;
  let useCase: UpdateRestaurantSettingsUseCase;
  let restaurant: Restaurant;

  beforeEach(async () => {
    repo = new FakeRestaurantRepository();
    useCase = new UpdateRestaurantSettingsUseCase(repo);
    restaurant = Restaurant.create(OrganizationId.generate(), RestaurantName.create("Le Gourmet"), settings);
    await repo.save(restaurant);
  });

  test("updates toggles", async () => {
    const result = await useCase.execute({ id: restaurant.id.toString(), tableService: false, testMode: true });

    expect(result.tableService).toBe(false);
    expect(result.testMode).toBe(true);
    expect(result.clickAndCollect).toBe(true);
  });

  test("updates capacity", async () => {
    const result = await useCase.execute({ id: restaurant.id.toString(), maxCovers: 120 });

    expect(result.maxCovers).toBe(120);
  });

  test("rejects invalid maxCovers", async () => {
    await expect(useCase.execute({ id: restaurant.id.toString(), maxCovers: 0 })).rejects.toThrow(RestaurantInvalidSettingsError);
  });

  test("throws when not found", async () => {
    await expect(useCase.execute({ id: RestaurantId.generate().toString(), maxCovers: 1 })).rejects.toThrow(RestaurantNotFoundError);
  });
});
