import { Dish, DishId, DishNotFoundError, Money, RestaurantId } from "@workspace/domain";

import type { IDishRepository } from "@workspace/domain";

import type {
  CreateDishDTO,
  DeleteDishDTO,
  DishResponseDTO,
  GetDishDTO,
  ListDishesDTO,
  PaginatedDishesResponseDTO,
  UpdateDishDTO
} from "@/dtos/dish/dish.dtos";

import { DishMapper } from "@/mappers/dish/dish.mapper";

export class CreateDishUseCase {
  constructor(private readonly repo: IDishRepository) {}

  async execute(dto: CreateDishDTO): Promise<DishResponseDTO> {
    const dish = Dish.create(RestaurantId.create(dto.restaurantId), {
      name: dto.name,
      description: dto.description ?? null,
      price: Money.fromCents(dto.priceCents),
      category: dto.category,
      imageUrl: dto.imageUrl ?? null,
      isActive: dto.isActive ?? true
    });

    await this.repo.save(dish);

    return DishMapper.toResponseDTO(dish);
  }
}

export class GetDishUseCase {
  constructor(private readonly repo: IDishRepository) {}

  async execute(dto: GetDishDTO): Promise<DishResponseDTO> {
    const dish = await this.repo.findById(DishId.create(dto.id));

    if (!dish) {
      throw new DishNotFoundError(dto.id);
    }

    return DishMapper.toResponseDTO(dish);
  }
}

export class ListDishesUseCase {
  constructor(private readonly repo: IDishRepository) {}

  async execute(dto: ListDishesDTO): Promise<PaginatedDishesResponseDTO> {
    const result = await this.repo.findByRestaurant(RestaurantId.create(dto.restaurantId), {
      page: dto.page,
      limit: dto.limit
    });

    return {
      data: result.data.map(DishMapper.toResponseDTO),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    };
  }
}

export class UpdateDishUseCase {
  constructor(private readonly repo: IDishRepository) {}

  async execute(dto: UpdateDishDTO): Promise<DishResponseDTO> {
    const id = DishId.create(dto.id);
    const existing = await this.repo.findById(id);

    if (!existing) {
      throw new DishNotFoundError(dto.id);
    }

    const updated = existing.update({
      name: dto.name,
      description: dto.description ?? null,
      price: Money.fromCents(dto.priceCents),
      category: dto.category,
      imageUrl: dto.imageUrl ?? null,
      isActive: dto.isActive
    });

    await this.repo.save(updated);

    return DishMapper.toResponseDTO(updated);
  }
}

export class DeleteDishUseCase {
  constructor(private readonly repo: IDishRepository) {}

  async execute(dto: DeleteDishDTO): Promise<void> {
    const id = DishId.create(dto.id);
    const existing = await this.repo.findById(id);

    if (!existing) {
      throw new DishNotFoundError(dto.id);
    }

    await this.repo.delete(id);
  }
}
