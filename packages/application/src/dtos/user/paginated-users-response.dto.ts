import type { UserResponseDTO } from "./user-response.dto";
import type { PaginatedResult } from "@workspace/domain";


export type PaginatedUsersResponseDTO = PaginatedResult<UserResponseDTO>;
