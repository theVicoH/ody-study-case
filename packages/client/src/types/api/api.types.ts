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
