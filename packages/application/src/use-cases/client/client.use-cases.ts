import { Client, ClientId, ClientNotFoundError, RestaurantId } from "@workspace/domain";

import type { IClientRepository } from "@workspace/domain";

import type {
  ClientResponseDTO,
  CreateClientDTO,
  DeleteClientDTO,
  GetClientDTO,
  ListClientsDTO,
  PaginatedClientsResponseDTO,
  UpdateClientDTO
} from "@/dtos/client/client.dtos";

import { ClientMapper } from "@/mappers/client/client.mapper";

export class CreateClientUseCase {
  constructor(private readonly repo: IClientRepository) {}

  async execute(dto: CreateClientDTO): Promise<ClientResponseDTO> {
    const client = Client.create(RestaurantId.create(dto.restaurantId), {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      notes: dto.notes ?? null
    });

    await this.repo.save(client);

    return ClientMapper.toResponseDTO(client);
  }
}

export class GetClientUseCase {
  constructor(private readonly repo: IClientRepository) {}

  async execute(dto: GetClientDTO): Promise<ClientResponseDTO> {
    const id = ClientId.create(dto.id);
    const client = await this.repo.findById(id);

    if (!client) {
      throw new ClientNotFoundError(dto.id);
    }

    return ClientMapper.toResponseDTO(client);
  }
}

export class ListClientsUseCase {
  constructor(private readonly repo: IClientRepository) {}

  async execute(dto: ListClientsDTO): Promise<PaginatedClientsResponseDTO> {
    const result = await this.repo.findByRestaurant(RestaurantId.create(dto.restaurantId), {
      page: dto.page,
      limit: dto.limit
    });

    return {
      data: result.data.map(ClientMapper.toResponseDTO),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }
}

export class UpdateClientUseCase {
  constructor(private readonly repo: IClientRepository) {}

  async execute(dto: UpdateClientDTO): Promise<ClientResponseDTO> {
    const id = ClientId.create(dto.id);
    const existing = await this.repo.findById(id);

    if (!existing) {
      throw new ClientNotFoundError(dto.id);
    }

    const updated = existing.update({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      notes: dto.notes ?? null
    });

    await this.repo.save(updated);

    return ClientMapper.toResponseDTO(updated);
  }
}

export class DeleteClientUseCase {
  constructor(private readonly repo: IClientRepository) {}

  async execute(dto: DeleteClientDTO): Promise<void> {
    const id = ClientId.create(dto.id);
    const existing = await this.repo.findById(id);

    if (!existing) {
      throw new ClientNotFoundError(dto.id);
    }

    await this.repo.delete(id);
  }
}
