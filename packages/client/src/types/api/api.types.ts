export interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthday: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiOrganization {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiRestaurant {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  phone: string;
  maxCovers: number;
  tableService: boolean;
  clickAndCollect: boolean;
  kitchenNotifications: boolean;
  testMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPaginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateOrganizationInput {
  name: string;
  ownerId: string;
}

export interface CreateRestaurantInput {
  organizationId: string;
  name: string;
  address: string;
  phone: string;
  maxCovers: number;
  tableService?: boolean;
  clickAndCollect?: boolean;
  kitchenNotifications?: boolean;
  testMode?: boolean;
}

export interface UpdateRestaurantSettingsInput {
  address?: string;
  phone?: string;
  maxCovers?: number;
  tableService?: boolean;
  clickAndCollect?: boolean;
  kitchenNotifications?: boolean;
  testMode?: boolean;
}

export interface ApiOpeningHour {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export type ApiTableZone = "salle" | "terrasse" | "bar" | "vip";

export type ApiTableStatus = "available" | "occupied" | "reserved";

export interface ApiRestaurantTable {
  id: string;
  restaurantId: string;
  number: number;
  name: string | null;
  capacity: number;
  zone: ApiTableZone;
  status: ApiTableStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableInput {
  number: number;
  name?: string;
  capacity?: number;
  zone?: ApiTableZone;
  status?: ApiTableStatus;
  isActive?: boolean;
}

export interface UpdateTableInput {
  number?: number;
  name?: string | null;
  capacity?: number;
  zone?: ApiTableZone;
  status?: ApiTableStatus;
  isActive?: boolean;
}

export interface BulkGenerateTablesInput {
  count: number;
  startNumber?: number;
  capacity?: number;
  zone?: ApiTableZone;
}

export interface ListTablesQuery {
  page?: number;
  limit?: number;
  zone?: ApiTableZone;
  status?: ApiTableStatus;
}

export interface ApiClient {
  id: string;
  restaurantId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientInput {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
}

export type UpdateClientInput = CreateClientInput;

export interface ApiDish {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  priceCents: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDishInput {
  name: string;
  description?: string | null;
  priceCents: number;
  category: string;
  isActive?: boolean;
}

export interface UpdateDishInput {
  name: string;
  description?: string | null;
  priceCents: number;
  category: string;
  isActive: boolean;
}

export interface ApiMenu {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  priceCents: number;
  isActive: boolean;
  dishIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuInput {
  name: string;
  description?: string | null;
  priceCents: number;
  isActive?: boolean;
  dishIds: string[];
}

export interface UpdateMenuInput {
  name: string;
  description?: string | null;
  priceCents: number;
  isActive: boolean;
  dishIds: string[];
}

export type ApiOrderStatus = "pending" | "preparing" | "ready" | "served" | "paid" | "cancelled";

export interface ApiOrderItem {
  id: string;
  kind: "menu" | "dish";
  refId: string;
  nameSnapshot: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface ApiOrder {
  id: string;
  restaurantId: string;
  clientId: string | null;
  tableId: string | null;
  status: ApiOrderStatus;
  notes: string | null;
  placedAt: string;
  totalCents: number;
  items: ApiOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  clientId?: string | null;
  tableId?: string | null;
  status?: ApiOrderStatus;
  notes?: string | null;
  placedAt?: string;
  items: Array<{ kind: "menu" | "dish"; refId: string; quantity: number }>;
}

export interface ListOrdersQuery {
  page?: number;
  limit?: number;
  clientId?: string;
}
