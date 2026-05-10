import { api } from "@/lib/api/api.client";

import type { ApiOrganization, ApiPaginated, CreateOrganizationInput } from "@/types/api/api.types";

const DEFAULT_LIMIT = 50;

export const organizationsApi = {
  list(ownerId?: string): Promise<ApiPaginated<ApiOrganization>> {
    const params = new URLSearchParams({ limit: String(DEFAULT_LIMIT) });

    if (ownerId) params.set("ownerId", ownerId);

    return api.get<ApiPaginated<ApiOrganization>>(`/organizations?${params.toString()}`);
  },
  create(input: CreateOrganizationInput): Promise<ApiOrganization> {
    return api.post<ApiOrganization>("/organizations", input);
  }
};
