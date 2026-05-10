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
