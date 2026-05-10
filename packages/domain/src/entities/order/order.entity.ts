import { OrderInvalidDataError } from "@/errors/order/order-invalid-data/order-invalid-data.error";

import { OrderItem } from "@/entities/order/order-item.entity";
import { ClientId } from "@/value-objects/client/client-id/client-id.value-object";
import { Money } from "@/value-objects/shared/money/money.value-object";
import { OrderId } from "@/value-objects/order/order-id/order-id.value-object";
import { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";

export const ORDER_STATUS = {
  PENDING: "pending",
  PREPARING: "preparing",
  READY: "ready",
  SERVED: "served",
  PAID: "paid",
  CANCELLED: "cancelled"
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

const ALLOWED_STATUSES = new Set<OrderStatus>(Object.values(ORDER_STATUS));

export interface OrderProps {
  clientId: ClientId | null;
  tableId: string | null;
  status: OrderStatus;
  notes: string | null;
  placedAt: Date;
  items: ReadonlyArray<OrderItem>;
}

const validate = (props: OrderProps): OrderProps => {
  if (!ALLOWED_STATUSES.has(props.status)) {
    throw new OrderInvalidDataError("status", props.status);
  }

  if (props.items.length === 0) {
    throw new OrderInvalidDataError("items", "empty");
  }

  const notes = props.notes?.trim() || null;

  return { ...props, notes };
};

export class Order {
  private constructor(
    public readonly id: OrderId,
    public readonly restaurantId: RestaurantId,
    public readonly props: OrderProps,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(restaurantId: RestaurantId, props: OrderProps): Order {
    const now = new Date();

    return new Order(OrderId.generate(), restaurantId, validate(props), now, now);
  }

  static reconstitute(
    id: OrderId,
    restaurantId: RestaurantId,
    props: OrderProps,
    createdAt: Date,
    updatedAt: Date
  ): Order {
    return new Order(id, restaurantId, props, createdAt, updatedAt);
  }

  total(): Money {
    return this.props.items.reduce<Money>((acc, item) => acc.add(item.lineTotal()), Money.zero());
  }

  changeStatus(status: OrderStatus): Order {
    return new Order(this.id, this.restaurantId, validate({ ...this.props, status }), this.createdAt, new Date());
  }

  replaceItems(items: ReadonlyArray<OrderItem>): Order {
    return new Order(this.id, this.restaurantId, validate({ ...this.props, items }), this.createdAt, new Date());
  }
}
