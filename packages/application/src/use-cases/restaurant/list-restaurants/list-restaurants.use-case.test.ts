import { OrganizationId, Restaurant, RestaurantName, RestaurantSettings } from "@workspace/domain";
import { beforeEach, describe, expect, test } from "vitest";

import { FakeRestaurantRepository } from "@/fakes/restaurant/restaurant.fake";
import { ListRestaurantsUseCase } from "@/use-cases/restaurant/list-restaurants/list-restaurants.use-case";

const settings = RestaurantSettings.create({
  address: "1 rue de la Paix",
  phone: "+33 1 23 45 67 89",
  maxCovers: 80,
  tableService: true,
  clickAndCollect: true,
  kitchenNotifications: true,
  testMode: false
});

const orgA = OrganizationId.generate();
const orgB = OrganizationId.generate();

describe("ListRestaurantsUseCase", () => {
  let repo: FakeRestaurantRepository;
  let useCase: ListRestaurantsUseCase;

  beforeEach(async () => {
    repo = new FakeRestaurantRepository();
    useCase = new ListRestaurantsUseCase(repo);
    await repo.save(Restaurant.create(orgA, RestaurantName.create("A1"), settings));
    await repo.save(Restaurant.create(orgA, RestaurantName.create("A2"), settings));
    await repo.save(Restaurant.create(orgB, RestaurantName.create("B1"), settings));
  });

  test("lists all", async () => {
    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.total).toBe(3);
  });

  test("filters by organizationId", async () => {
    const result = await useCase.execute({ page: 1, limit: 10, organizationId: orgA.toString() });

    expect(result.total).toBe(2);
  });
});
