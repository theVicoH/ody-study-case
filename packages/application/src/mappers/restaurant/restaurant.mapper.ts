import type { RestaurantResponseDTO } from "@/dtos/restaurant/restaurant-response.dto";
import type { Restaurant } from "@workspace/domain";

export class RestaurantMapper {
  static toResponseDTO(r: Restaurant): RestaurantResponseDTO {
    return {
      id: r.id.toString(),
      organizationId: r.organizationId.toString(),
      name: r.name.toString(),
      address: r.settings.address,
      phone: r.settings.phone,
      maxCovers: r.settings.maxCovers,
      tableService: r.settings.tableService,
      clickAndCollect: r.settings.clickAndCollect,
      kitchenNotifications: r.settings.kitchenNotifications,
      testMode: r.settings.testMode,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    };
  }
}
