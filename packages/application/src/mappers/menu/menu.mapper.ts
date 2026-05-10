import type { MenuResponseDTO } from "@/dtos/menu/menu.dtos";
import type { Menu } from "@workspace/domain";

export class MenuMapper {
  static toResponseDTO(m: Menu): MenuResponseDTO {
    return {
      id: m.id.toString(),
      restaurantId: m.restaurantId.toString(),
      name: m.props.name,
      description: m.props.description,
      priceCents: m.props.price.toCents(),
      isActive: m.props.isActive,
      dishIds: m.props.dishIds.map((d) => d.toString()),
      createdAt: m.createdAt,
      updatedAt: m.updatedAt
    };
  }
}
