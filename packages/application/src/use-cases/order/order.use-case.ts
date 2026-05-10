import {
  ClientId,
  DishId,
  DishNotFoundError,
  MenuId,
  MenuNotFoundError,
  Order,
  OrderId,
  OrderInvalidDataError,
  OrderItem,
  OrderNotFoundError,
  RestaurantId
} from "@workspace/domain";

import type {
  CreateOrderDTO,
  CreateOrderItemDTO,
  DeleteOrderDTO,
  GetOrderDTO,
  ListOrdersDTO,
  OrderResponseDTO,
  PaginatedOrdersResponseDTO,
  UpdateOrderStatusDTO
} from "@/dtos/order/order.dto";
import type { IDishRepository, IMenuRepository, IOrderRepository, OrderItemRef } from "@workspace/domain";


import { OrderMapper } from "@/mappers/order/order.mapper";

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly dishRepo: IDishRepository,
    private readonly menuRepo: IMenuRepository
  ) {}

  async execute(dto: CreateOrderDTO): Promise<OrderResponseDTO> {
    if (dto.items.length === 0) {
      throw new OrderInvalidDataError("items", "empty");
    }

    const items = await Promise.all(dto.items.map((it) => this.buildItem(it)));

    const order = Order.create(RestaurantId.create(dto.restaurantId), {
      clientId: dto.clientId ? ClientId.create(dto.clientId) : null,
      tableId: dto.tableId ?? null,
      status: dto.status ?? "pending",
      notes: dto.notes ?? null,
      placedAt: dto.placedAt ?? new Date(),
      items
    });

    await this.orderRepo.save(order);

    return OrderMapper.toResponseDTO(order);
  }

  private async buildItem(dto: CreateOrderItemDTO): Promise<OrderItem> {
    if (dto.kind === "dish") {
      const dishId = DishId.create(dto.refId);
      const dish = await this.dishRepo.findById(dishId);

      if (!dish) {
        throw new DishNotFoundError(dto.refId);
      }

      const ref: OrderItemRef = { kind: "dish", dishId };

      return OrderItem.create({
        ref,
        nameSnapshot: dish.props.name,
        unitPrice: dish.props.price,
        quantity: dto.quantity
      });
    }

    const menuId = MenuId.create(dto.refId);
    const menu = await this.menuRepo.findById(menuId);

    if (!menu) {
      throw new MenuNotFoundError(dto.refId);
    }

    const ref: OrderItemRef = { kind: "menu", menuId };

    return OrderItem.create({
      ref,
      nameSnapshot: menu.props.name,
      unitPrice: menu.props.price,
      quantity: dto.quantity
    });
  }
}

export class GetOrderUseCase {
  constructor(private readonly repo: IOrderRepository) {}

  async execute(dto: GetOrderDTO): Promise<OrderResponseDTO> {
    const order = await this.repo.findById(OrderId.create(dto.id));

    if (!order) {
      throw new OrderNotFoundError(dto.id);
    }

    return OrderMapper.toResponseDTO(order);
  }
}

export class ListOrdersUseCase {
  constructor(private readonly repo: IOrderRepository) {}

  async execute(dto: ListOrdersDTO): Promise<PaginatedOrdersResponseDTO> {
    const params = { page: dto.page, limit: dto.limit };
    const result = dto.clientId
      ? await this.repo.findByClient(ClientId.create(dto.clientId), params)
      : await this.repo.findByRestaurant(RestaurantId.create(dto.restaurantId), params);

    return {
      data: result.data.map(OrderMapper.toResponseDTO),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }
}

export class UpdateOrderStatusUseCase {
  constructor(private readonly repo: IOrderRepository) {}

  async execute(dto: UpdateOrderStatusDTO): Promise<OrderResponseDTO> {
    const id = OrderId.create(dto.id);
    const existing = await this.repo.findById(id);

    if (!existing) {
      throw new OrderNotFoundError(dto.id);
    }

    const updated = existing.changeStatus(dto.status);

    await this.repo.save(updated);

    return OrderMapper.toResponseDTO(updated);
  }
}

export class DeleteOrderUseCase {
  constructor(private readonly repo: IOrderRepository) {}

  async execute(dto: DeleteOrderDTO): Promise<void> {
    const id = OrderId.create(dto.id);
    const existing = await this.repo.findById(id);

    if (!existing) {
      throw new OrderNotFoundError(dto.id);
    }

    await this.repo.delete(id);
  }
}
