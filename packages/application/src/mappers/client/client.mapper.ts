import type { ClientResponseDTO } from "@/dtos/client/client.dto";
import type { Client } from "@workspace/domain";

export class ClientMapper {
  static toResponseDTO(c: Client): ClientResponseDTO {
    return {
      id: c.id.toString(),
      restaurantId: c.restaurantId.toString(),
      firstName: c.props.firstName,
      lastName: c.props.lastName,
      email: c.props.email,
      phone: c.props.phone,
      notes: c.props.notes,
      tag: c.props.tag,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    };
  }
}
