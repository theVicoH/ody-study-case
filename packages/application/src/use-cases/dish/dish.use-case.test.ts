import { DishNotFoundError } from "@workspace/domain";
import { describe, expect, test } from "vitest";

import { FakeDishRepository } from "@/fakes/dish/dish.fake";
import {
  CreateDishUseCase,
  DeleteDishUseCase,
  GetDishUseCase,
  ListDishesUseCase,
  UpdateDishUseCase
} from "@/use-cases/dish/dish.use-case";

const restaurantId = "11111111-1111-1111-1111-111111111111";
const PRICE_CENTS = 1500;
const NEW_PRICE_CENTS = 1800;

const buildRepo = (): FakeDishRepository => new FakeDishRepository();

describe("Dish use-cases", () => {
  test("create then get", async () => {
    const repo = buildRepo();
    const created = await new CreateDishUseCase(repo).execute({
      restaurantId,
      name: "Pizza",
      priceCents: PRICE_CENTS,
      category: "main"
    });

    const fetched = await new GetDishUseCase(repo).execute({ id: created.id });

    expect(fetched.name).toBe("Pizza");
  });

  test("list returns paginated", async () => {
    const repo = buildRepo();
    const create = new CreateDishUseCase(repo);

    await create.execute({ restaurantId, name: "A", priceCents: PRICE_CENTS, category: "main" });
    await create.execute({ restaurantId, name: "B", priceCents: PRICE_CENTS, category: "main" });

    const result = await new ListDishesUseCase(repo).execute({ restaurantId, page: 1, limit: 10 });

    expect(result.total).toBe(2);
  });

  test("update modifies the dish", async () => {
    const repo = buildRepo();
    const created = await new CreateDishUseCase(repo).execute({
      restaurantId,
      name: "Pizza",
      priceCents: PRICE_CENTS,
      category: "main"
    });

    const updated = await new UpdateDishUseCase(repo).execute({
      id: created.id,
      name: "Pizza Deluxe",
      priceCents: NEW_PRICE_CENTS,
      category: "main",
      isActive: true
    });

    expect(updated.name).toBe("Pizza Deluxe");
  });

  test("delete removes the dish", async () => {
    const repo = buildRepo();
    const created = await new CreateDishUseCase(repo).execute({
      restaurantId,
      name: "Pizza",
      priceCents: PRICE_CENTS,
      category: "main"
    });

    await new DeleteDishUseCase(repo).execute({ id: created.id });

    await expect(new GetDishUseCase(repo).execute({ id: created.id })).rejects.toThrow(DishNotFoundError);
  });
});
