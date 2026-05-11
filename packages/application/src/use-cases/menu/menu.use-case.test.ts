import { MenuNotFoundError } from "@workspace/domain";
import { describe, expect, test } from "vitest";

import { FakeMenuRepository } from "@/fakes/menu/menu.fake";
import {
  CreateMenuUseCase,
  DeleteMenuUseCase,
  GetMenuUseCase,
  ListMenusUseCase,
  UpdateMenuUseCase
} from "@/use-cases/menu/menu.use-case";

const restaurantId = "11111111-1111-1111-1111-111111111111";
const PRICE_CENTS = 2500;
const NEW_PRICE_CENTS = 3000;

const buildRepo = (): FakeMenuRepository => new FakeMenuRepository();

describe("Menu use-cases", () => {
  test("create then get", async () => {
    const repo = buildRepo();
    const created = await new CreateMenuUseCase(repo).execute({
      restaurantId,
      name: "Lunch",
      priceCents: PRICE_CENTS,
      dishIds: []
    });

    const fetched = await new GetMenuUseCase(repo).execute({ id: created.id });

    expect(fetched.name).toBe("Lunch");
  });

  test("list returns paginated", async () => {
    const repo = buildRepo();
    const create = new CreateMenuUseCase(repo);

    await create.execute({ restaurantId, name: "A", priceCents: PRICE_CENTS, dishIds: [] });
    await create.execute({ restaurantId, name: "B", priceCents: PRICE_CENTS, dishIds: [] });

    const result = await new ListMenusUseCase(repo).execute({ restaurantId, page: 1, limit: 10 });

    expect(result.total).toBe(2);
  });

  test("update modifies the menu", async () => {
    const repo = buildRepo();
    const created = await new CreateMenuUseCase(repo).execute({
      restaurantId,
      name: "Lunch",
      priceCents: PRICE_CENTS,
      dishIds: []
    });

    const updated = await new UpdateMenuUseCase(repo).execute({
      id: created.id,
      name: "Lunch Deluxe",
      priceCents: NEW_PRICE_CENTS,
      isActive: true,
      dishIds: []
    });

    expect(updated.name).toBe("Lunch Deluxe");
  });

  test("delete removes the menu", async () => {
    const repo = buildRepo();
    const created = await new CreateMenuUseCase(repo).execute({
      restaurantId,
      name: "Lunch",
      priceCents: PRICE_CENTS,
      dishIds: []
    });

    await new DeleteMenuUseCase(repo).execute({ id: created.id });

    await expect(new GetMenuUseCase(repo).execute({ id: created.id })).rejects.toThrow(MenuNotFoundError);
  });
});
