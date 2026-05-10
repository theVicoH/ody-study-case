import { apiRoutes } from "@workspace/shared";

import type { ApiUser } from "@/types/api/api.types";

import { api } from "@/lib/api/api.client";


interface BetterAuthSession {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    birthday?: string;
    emailVerified?: boolean;
    image?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
}

const toApiUser = (session: BetterAuthSession): ApiUser => ({
  id: session.user.id,
  email: session.user.email,
  firstName: session.user.firstName ?? "",
  lastName: session.user.lastName ?? "",
  birthday: session.user.birthday ?? "",
  emailVerified: session.user.emailVerified ?? false,
  image: session.user.image ?? null,
  createdAt: session.user.createdAt ?? new Date().toISOString(),
  updatedAt: session.user.updatedAt ?? new Date().toISOString()
});

export const authApi = {
  async me(): Promise<ApiUser | null> {
    try {
      const session = await api.get<BetterAuthSession | null>(apiRoutes.auth.session);

      if (!session?.user) return null;

      return toApiUser(session);
    } catch {
      return null;
    }
  }
};
