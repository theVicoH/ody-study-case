import { apiRoutes, buildQuery } from "@workspace/shared";

import type { ApiOrganization, ApiPaginated, CreateOrganizationInput } from "@/types/api/api.types";

import { api } from "@/lib/api/api.client";


const DEFAULT_LIMIT = 50;

export const organizationsApi = {
  list(ownerId?: string): Promise<ApiPaginated<ApiOrganization>> {
    return api.get<ApiPaginated<ApiOrganization>>(`${apiRoutes.organizations.base}${buildQuery({ limit: DEFAULT_LIMIT, ownerId })}`);
  },
  create(input: CreateOrganizationInput): Promise<ApiOrganization> {
    return api.post<ApiOrganization>(apiRoutes.organizations.base, input);
  },
  update(id: string, input: { name: string }): Promise<ApiOrganization> {
    return api.patch<ApiOrganization>(apiRoutes.organizations.byId(id), input);
  },
  delete(id: string): Promise<void> {
    return api.delete<void>(apiRoutes.organizations.byId(id));
  }
};
