
import type { DishId } from "@/value-objects/dish/dish-id/dish-id.value-object";
import type { MenuId } from "@/value-objects/menu/menu-id/menu-id.value-object";
import type { Money } from "@/value-objects/shared/money/money.value-object";

import { OrderInvalidDataError } from "@/errors/order/order-invalid-data/order-invalid-data.error";
import { OrderItemId } from "@/value-objects/order/order-item-id/order-item-id.value-object";

export type OrderItemRef =
  | { kind: "menu"; menuId: MenuId }
  | { kind: "dish"; dishId: DishId };

export interface OrderItemProps {
  ref: OrderItemRef;
  nameSnapshot: string;
  unitPrice: Money;
  quantity: number;
}

const validate = (props: OrderItemProps): OrderItemProps => {
  if (!Number.isInteger(props.quantity) || props.quantity <= 0) {
    throw new OrderInvalidDataError("quantity", props.quantity);
  }

  const nameSnapshot = props.nameSnapshot.trim();

  if (nameSnapshot.length === 0) {
    throw new OrderInvalidDataError("nameSnapshot", props.nameSnapshot);
  }

  return { ...props, nameSnapshot };
};

export class OrderItem {
  private constructor(public readonly id: OrderItemId, public readonly props: OrderItemProps) {}

  static create(props: OrderItemProps): OrderItem {
    return new OrderItem(OrderItemId.generate(), validate(props));
  }

  static reconstitute(id: OrderItemId, props: OrderItemProps): OrderItem {
    return new OrderItem(id, props);
  }

  lineTotal(): Money {
    return this.props.unitPrice.multiply(this.props.quantity);
  }
}
