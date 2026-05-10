import type { OrganizationResponseDTO } from "./organization-response.dto";
import type { PaginatedResult } from "@workspace/domain";

export type PaginatedOrganizationsResponseDTO = PaginatedResult<OrganizationResponseDTO>;
