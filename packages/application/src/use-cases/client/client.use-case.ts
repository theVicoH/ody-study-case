import { Client, ClientId, ClientNotFoundError, RestaurantId } from "@workspace/domain";

import type {
  ClientResponseDTO,
  CreateClientDTO,
  DeleteClientDTO,
  GetClientDTO,
  ListClientsDTO,
  PaginatedClientsResponseDTO,
  UpdateClientDTO
} from "@/dtos/client/client.dto";
import type { ClientTag, IClientRepository, IOrderRepository } from "@workspace/domain";


import { ClientMapper } from "@/mappers/client/client.mapper";

const VIP_VISIT_THRESHOLD = 10;
const REGULAR_VISIT_THRESHOLD = 3;
const TAG_RANK: Record<ClientTag, number> = { New: 0, Regular: 1, VIP: 2 };

const computeTag = (visits: number): ClientTag => {
  if (visits >= VIP_VISIT_THRESHOLD) return "VIP";
  if (visits >= REGULAR_VISIT_THRESHOLD) return "Regular";

  return "New";
};

export class CreateClientUseCase {
  constructor(private readonly repo: IClientRepository) {}

  async execute(dto: CreateClientDTO): Promise<ClientResponseDTO> {
    const client = Client.create(RestaurantId.create(dto.restaurantId), {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      notes: dto.notes ?? null,
      tag: "New"
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
  constructor(
    private readonly repo: IClientRepository,
    private readonly orderRepo?: IOrderRepository
  ) {}

  async execute(dto: ListClientsDTO): Promise<PaginatedClientsResponseDTO> {
    const result = await this.repo.findByRestaurant(RestaurantId.create(dto.restaurantId), {
      page: dto.page,
      limit: dto.limit
    });

    let clients = result.data;

    if (this.orderRepo) {
      const visitsByClient = await this.computeVisits(dto.restaurantId);
      const upgrades: Promise<void>[] = [];

      clients = clients.map((c) => {
        const visits = visitsByClient.get(c.id.toString()) ?? 0;
        const computed = computeTag(visits);

        if (TAG_RANK[computed] > TAG_RANK[c.props.tag]) {
          const upgraded = c.withTag(computed);

          upgrades.push(this.repo.save(upgraded));

          return upgraded;
        }

        return c;
      });

      if (upgrades.length > 0) await Promise.all(upgrades);
    }

    return {
      data: clients.map(ClientMapper.toResponseDTO),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }

  private async computeVisits(restaurantId: string): Promise<Map<string, number>> {
    const orderRepo = this.orderRepo;

    if (!orderRepo) return new Map();
    const PAGE = 200;
    const map = new Map<string, number>();
    let page = 1;

    for (;;) {
      const res = await orderRepo.findByRestaurant(RestaurantId.create(restaurantId), {
        page,
        limit: PAGE
      });

      for (const o of res.data) {
        const cid = o.props.clientId?.toString();

        if (!cid) continue;
        map.set(cid, (map.get(cid) ?? 0) + 1);
      }

      if (page >= res.totalPages) break;
      page += 1;
    }

    return map;
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
      notes: dto.notes ?? null,
      tag: dto.tag ?? existing.props.tag
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
