import type { ClientTag } from "@workspace/domain";

export interface ClientResponseDTO {
  id: string;
  restaurantId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  tag: ClientTag;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientDTO {
  restaurantId: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
}

export interface UpdateClientDTO {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  tag?: ClientTag;
}

export interface GetClientDTO {
  id: string;
}

export interface DeleteClientDTO {
  id: string;
}

export interface ListClientsDTO {
  restaurantId: string;
  page: number;
  limit: number;
}

export interface PaginatedClientsResponseDTO {
  data: ClientResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
