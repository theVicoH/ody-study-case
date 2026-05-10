import { api } from "@/lib/api/api.client";

import type { ApiUser } from "@/types/api/api.types";

export const authApi = {
  getOrCreateDemoUser(): Promise<ApiUser> {
    return api.get<ApiUser>("/auth/demo");
  }
};
