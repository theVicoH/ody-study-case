export interface DishResponseDTO {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  priceCents: number;
  category: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDishDTO {
  restaurantId: string;
  name: string;
  description?: string | null;
  priceCents: number;
  category: string;
  imageUrl?: string | null;
  isActive?: boolean;
}

export interface UpdateDishDTO {
  id: string;
  name: string;
  description?: string | null;
  priceCents: number;
  category: string;
  imageUrl?: string | null;
  isActive: boolean;
}

export interface GetDishDTO {
  id: string;
}

export interface DeleteDishDTO {
  id: string;
}

export interface ListDishesDTO {
  restaurantId: string;
  page: number;
  limit: number;
}

export interface PaginatedDishesResponseDTO {
  data: DishResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
