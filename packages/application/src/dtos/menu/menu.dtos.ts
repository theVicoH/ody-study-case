export interface MenuResponseDTO {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  priceCents: number;
  isActive: boolean;
  dishIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMenuDTO {
  restaurantId: string;
  name: string;
  description?: string | null;
  priceCents: number;
  isActive?: boolean;
  dishIds: string[];
}

export interface UpdateMenuDTO {
  id: string;
  name: string;
  description?: string | null;
  priceCents: number;
  isActive: boolean;
  dishIds: string[];
}

export interface GetMenuDTO {
  id: string;
}

export interface DeleteMenuDTO {
  id: string;
}

export interface ListMenusDTO {
  restaurantId: string;
  page: number;
  limit: number;
}

export interface PaginatedMenusResponseDTO {
  data: MenuResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
