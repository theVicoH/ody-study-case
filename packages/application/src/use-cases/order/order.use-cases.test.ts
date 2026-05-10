import { Dish, DishNotFoundError, Menu, Money, RestaurantId } from "@workspace/domain";
import { describe, expect, test } from "vitest";

import { FakeDishRepository } from "@/fakes/dish/dish.fake";
import { FakeMenuRepository } from "@/fakes/menu/menu.fake";
import { FakeOrderRepository } from "@/fakes/order/order.fake";
import {
  CreateOrderUseCase,
  GetOrderUseCase,
  ListOrdersUseCase,
  UpdateOrderStatusUseCase
} from "@/use-cases/order/order.use-cases";

const restaurantIdRaw = "22222222-2222-2222-2222-222222222222";
const restaurantId = RestaurantId.create(restaurantIdRaw);

const seed = async () => {
  const dishRepo = new FakeDishRepository();
  const menuRepo = new FakeMenuRepository();
  const orderRepo = new FakeOrderRepository();

  const dish = Dish.create(restaurantId, {
    name: "Burger",
    description: null,
    price: Money.fromCents(1200),
    category: "main",
    imageUrl: null,
    isActive: true
  });

  await dishRepo.save(dish);

  const menu = Menu.create(restaurantId, {
    name: "Formule",
    description: null,
    price: Money.fromCents(2500),
    isActive: true,
    dishIds: [dish.id]
  });

  await menuRepo.save(menu);

  return { dishRepo, menuRepo, orderRepo, dish, menu };
};

describe("Order use-cases", () => {
  test("create snapshots dish name + price", async () => {
    const { dishRepo, menuRepo, orderRepo, dish } = await seed();
    const created = await new CreateOrderUseCase(orderRepo, dishRepo, menuRepo).execute({
      restaurantId: restaurantIdRaw,
      items: [{ kind: "dish", refId: dish.id.toString(), quantity: 2 }]
    });

    expect(created.items).toHaveLength(1);
    expect(created.items[0]?.nameSnapshot).toBe("Burger");
    expect(created.items[0]?.unitPriceCents).toBe(1200);
    expect(created.totalCents).toBe(2400);
  });

  test("create with menu ref", async () => {
    const { dishRepo, menuRepo, orderRepo, menu } = await seed();
    const created = await new CreateOrderUseCase(orderRepo, dishRepo, menuRepo).execute({
      restaurantId: restaurantIdRaw,
      items: [{ kind: "menu", refId: menu.id.toString(), quantity: 1 }]
    });

    expect(created.totalCents).toBe(2500);
    expect(created.items[0]?.kind).toBe("menu");
  });

  test("create rejects unknown dish", async () => {
    const { dishRepo, menuRepo, orderRepo } = await seed();

    await expect(
      new CreateOrderUseCase(orderRepo, dishRepo, menuRepo).execute({
        restaurantId: restaurantIdRaw,
        items: [{ kind: "dish", refId: "33333333-3333-3333-3333-333333333333", quantity: 1 }]
      })
    ).rejects.toBeInstanceOf(DishNotFoundError);
  });

  test("update status", async () => {
    const { dishRepo, menuRepo, orderRepo, dish } = await seed();
    const created = await new CreateOrderUseCase(orderRepo, dishRepo, menuRepo).execute({
      restaurantId: restaurantIdRaw,
      items: [{ kind: "dish", refId: dish.id.toString(), quantity: 1 }]
    });

    const updated = await new UpdateOrderStatusUseCase(orderRepo).execute({
      id: created.id,
      status: "paid"
    });

    expect(updated.status).toBe("paid");
  });

  test("list and get", async () => {
    const { dishRepo, menuRepo, orderRepo, dish } = await seed();
    const create = new CreateOrderUseCase(orderRepo, dishRepo, menuRepo);

    await create.execute({
      restaurantId: restaurantIdRaw,
      items: [{ kind: "dish", refId: dish.id.toString(), quantity: 1 }]
    });

    const list = await new ListOrdersUseCase(orderRepo).execute({
      restaurantId: restaurantIdRaw,
      page: 1,
      limit: 10
    });

    expect(list.total).toBe(1);

    const fetched = await new GetOrderUseCase(orderRepo).execute({ id: list.data[0]!.id });

    expect(fetched.id).toBe(list.data[0]!.id);
  });
});
