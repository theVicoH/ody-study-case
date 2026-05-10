import type { DishResponseDTO } from "@/dtos/dish/dish.dtos";
import type { Dish } from "@workspace/domain";

export class DishMapper {
  static toResponseDTO(d: Dish): DishResponseDTO {
    return {
      id: d.id.toString(),
      restaurantId: d.restaurantId.toString(),
      name: d.props.name,
      description: d.props.description,
      priceCents: d.props.price.toCents(),
      category: d.props.category,
      isActive: d.props.isActive,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt
    };
  }
}
