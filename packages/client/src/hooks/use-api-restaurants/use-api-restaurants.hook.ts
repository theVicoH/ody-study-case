import { useCallback, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { restaurantModelsStorage } from "@/lib/restaurant-visuals/restaurant-models-storage.util";
import { toVisualRestaurant } from "@/lib/restaurant-visuals/restaurant-visuals.util";
import { authApi } from "@/services/api/auth-api/auth-api.service";
import { organizationsApi } from "@/services/api/organizations-api/organizations-api.service";
import { restaurantsApi } from "@/services/api/restaurants-api/restaurants-api.service";

import type { ApiOrganization, ApiUser, CreateRestaurantInput } from "@/types/api/api.types";
import type { Restaurant } from "@/types/restaurant/restaurant.types";

export interface UseApiRestaurantsReturn {
  user: ApiUser | null;
  organization: ApiOrganization | null;
  restaurants: ReadonlyArray<Restaurant>;
  loading: boolean;
  error: string | null;
  createOrganization: (name: string) => Promise<ApiOrganization>;
  createRestaurant: (input: Omit<CreateRestaurantInput, "organizationId">, modelId: string) => Promise<Restaurant>;
  reload: () => Promise<void>;
}

export function useApiRestaurants(): UseApiRestaurantsReturn {
  const { t } = useTranslation("common");
  const [user, setUser] = useState<ApiUser | null>(null);
  const [organization, setOrganization] = useState<ApiOrganization | null>(null);
  const [apiRestaurants, setApiRestaurants] = useState<ReadonlyArray<{ id: string; name: string; address: string }>>([]);
  const [modelMap, setModelMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const me = await authApi.me();

      if (!me) {
        setUser(null);
        setOrganization(null);
        setApiRestaurants([]);

        return;
      }

      setUser(me);

      const orgs = await organizationsApi.list(me.id);
      const firstOrg = orgs.data[0] ?? null;

      setOrganization(firstOrg);

      if (firstOrg) {
        const restos = await restaurantsApi.list(firstOrg.id);

        setApiRestaurants(restos.data);
      } else {
        setApiRestaurants([]);
      }

      setModelMap(restaurantModelsStorage.getAll());
    } catch (e) {
      const message = e instanceof Error ? e.message : t("errors.loadFailed");

      setError(message);
      toast.error(t("errors.loadFailed"), { description: message });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const restaurants = useMemo<ReadonlyArray<Restaurant>>(() => {
    const total = apiRestaurants.length;

    return apiRestaurants.map((r, index) => toVisualRestaurant(r, index, total, { modelId: modelMap[r.id] }));
  }, [apiRestaurants, modelMap]);

  const createOrganization = useCallback(async (name: string): Promise<ApiOrganization> => {
    if (!user) throw new Error("Demo user not loaded");
    try {
      const created = await organizationsApi.create({ name, ownerId: user.id });

      setOrganization(created);

      return created;
    } catch (e) {
      const message = e instanceof Error ? e.message : t("errors.createOrganizationFailed");

      toast.error(t("errors.createOrganizationFailed"), { description: message });
      throw e;
    }
  }, [user, t]);

  const createRestaurant = useCallback(async (
    input: Omit<CreateRestaurantInput, "organizationId">,
    modelId: string
  ): Promise<Restaurant> => {
    if (!organization) throw new Error("Organization not loaded");
    try {
      const created = await restaurantsApi.create({ ...input, organizationId: organization.id });

      restaurantModelsStorage.set(created.id, modelId);

      setApiRestaurants((prev) => [...prev, created]);
      setModelMap(restaurantModelsStorage.getAll());

      const total = apiRestaurants.length + 1;

      return toVisualRestaurant(created, total - 1, total, { modelId });
    } catch (e) {
      const message = e instanceof Error ? e.message : t("errors.createRestaurantFailed");

      toast.error(t("errors.createRestaurantFailed"), { description: message });
      throw e;
    }
  }, [organization, apiRestaurants.length, t]);

  return {
    user,
    organization,
    restaurants,
    loading,
    error,
    createOrganization,
    createRestaurant,
    reload: load
  };
}
