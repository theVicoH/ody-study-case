import type { OrderStatus } from "@workspace/domain";

export interface OrderItemResponseDTO {
  id: string;
  kind: "menu" | "dish";
  refId: string;
  nameSnapshot: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface OrderResponseDTO {
  id: string;
  restaurantId: string;
  clientId: string | null;
  tableId: string | null;
  status: OrderStatus;
  notes: string | null;
  placedAt: Date;
  totalCents: number;
  items: OrderItemResponseDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderItemDTO {
  kind: "menu" | "dish";
  refId: string;
  quantity: number;
}

export interface CreateOrderDTO {
  restaurantId: string;
  clientId?: string | null;
  tableId?: string | null;
  status?: OrderStatus;
  notes?: string | null;
  placedAt?: Date;
  items: CreateOrderItemDTO[];
}

export interface UpdateOrderStatusDTO {
  id: string;
  status: OrderStatus;
}

export interface GetOrderDTO {
  id: string;
}

export interface DeleteOrderDTO {
  id: string;
}

export interface ListOrdersDTO {
  restaurantId: string;
  page: number;
  limit: number;
  clientId?: string;
}

export interface PaginatedOrdersResponseDTO {
  data: OrderResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
