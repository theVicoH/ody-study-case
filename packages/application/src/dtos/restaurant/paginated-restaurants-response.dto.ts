import type { RestaurantResponseDTO } from "./restaurant-response.dto";
import type { PaginatedResult } from "@workspace/domain";

export type PaginatedRestaurantsResponseDTO = PaginatedResult<RestaurantResponseDTO>;
