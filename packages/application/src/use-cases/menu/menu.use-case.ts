import { DishId, Menu, MenuId, MenuNotFoundError, Money, RestaurantId } from "@workspace/domain";

import type {
  CreateMenuDTO,
  DeleteMenuDTO,
  GetMenuDTO,
  ListMenusDTO,
  MenuResponseDTO,
  PaginatedMenusResponseDTO,
  UpdateMenuDTO
} from "@/dtos/menu/menu.dto";
import type { IMenuRepository } from "@workspace/domain";


import { MenuMapper } from "@/mappers/menu/menu.mapper";

export class CreateMenuUseCase {
  constructor(private readonly repo: IMenuRepository) {}

  async execute(dto: CreateMenuDTO): Promise<MenuResponseDTO> {
    const menu = Menu.create(RestaurantId.create(dto.restaurantId), {
      name: dto.name,
      description: dto.description ?? null,
      price: Money.fromCents(dto.priceCents),
      isActive: dto.isActive ?? true,
      dishIds: dto.dishIds.map((id) => DishId.create(id))
    });

    await this.repo.save(menu);

    return MenuMapper.toResponseDTO(menu);
  }
}

export class GetMenuUseCase {
  constructor(private readonly repo: IMenuRepository) {}

  async execute(dto: GetMenuDTO): Promise<MenuResponseDTO> {
    const menu = await this.repo.findById(MenuId.create(dto.id));

    if (!menu) {
      throw new MenuNotFoundError(dto.id);
    }

    return MenuMapper.toResponseDTO(menu);
  }
}

export class ListMenusUseCase {
  constructor(private readonly repo: IMenuRepository) {}

  async execute(dto: ListMenusDTO): Promise<PaginatedMenusResponseDTO> {
    const result = await this.repo.findByRestaurant(RestaurantId.create(dto.restaurantId), {
      page: dto.page,
      limit: dto.limit
    });

    return {
      data: result.data.map(MenuMapper.toResponseDTO),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }
}

export class UpdateMenuUseCase {
  constructor(private readonly repo: IMenuRepository) {}

  async execute(dto: UpdateMenuDTO): Promise<MenuResponseDTO> {
    const id = MenuId.create(dto.id);
    const existing = await this.repo.findById(id);

    if (!existing) {
      throw new MenuNotFoundError(dto.id);
    }

    const updated = existing.update({
      name: dto.name,
      description: dto.description ?? null,
      price: Money.fromCents(dto.priceCents),
      isActive: dto.isActive,
      dishIds: dto.dishIds.map((d) => DishId.create(d))
    });

    await this.repo.save(updated);

    return MenuMapper.toResponseDTO(updated);
  }
}

export class DeleteMenuUseCase {
  constructor(private readonly repo: IMenuRepository) {}

  async execute(dto: DeleteMenuDTO): Promise<void> {
    const id = MenuId.create(dto.id);
    const existing = await this.repo.findById(id);

    if (!existing) {
      throw new MenuNotFoundError(dto.id);
    }

    await this.repo.delete(id);
  }
}
