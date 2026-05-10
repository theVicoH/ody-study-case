import type { OrderItemResponseDTO, OrderResponseDTO } from "@/dtos/order/order.dto";
import type { Order, OrderItem } from "@workspace/domain";

export class OrderMapper {
  static toItemResponseDTO(item: OrderItem): OrderItemResponseDTO {
    const ref = item.props.ref;
    const refId = ref.kind === "menu" ? ref.menuId.toString() : ref.dishId.toString();

    return {
      id: item.id.toString(),
      kind: ref.kind,
      refId,
      nameSnapshot: item.props.nameSnapshot,
      unitPriceCents: item.props.unitPrice.toCents(),
      quantity: item.props.quantity,
      lineTotalCents: item.lineTotal().toCents()
    };
  }

  static toResponseDTO(o: Order): OrderResponseDTO {
    return {
      id: o.id.toString(),
      restaurantId: o.restaurantId.toString(),
      clientId: o.props.clientId?.toString() ?? null,
      tableId: o.props.tableId,
      status: o.props.status,
      notes: o.props.notes,
      placedAt: o.props.placedAt,
      totalCents: o.total().toCents(),
      items: o.props.items.map(OrderMapper.toItemResponseDTO),
      createdAt: o.createdAt,
      updatedAt: o.updatedAt
    };
  }
}
