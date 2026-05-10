import { useCallback, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import type { ApiOrganization, ApiRestaurant, ApiUser, CreateRestaurantInput } from "@/types/api/api.types";
import type { Restaurant, RestaurantSettings } from "@/types/restaurant/restaurant.types";

import { restaurantModelsStorage } from "@/lib/restaurant-visuals/restaurant-models-storage.util";
import { toVisualRestaurant } from "@/lib/restaurant-visuals/restaurant-visuals.util";
import { authApi } from "@/services/api/auth-api/auth-api.service";
import { organizationsApi } from "@/services/api/organizations-api/organizations-api.service";
import { restaurantsApi } from "@/services/api/restaurants-api/restaurants-api.service";


export interface UseApiRestaurantsReturn {
  user: ApiUser | null;
  organization: ApiOrganization | null;
  restaurants: ReadonlyArray<Restaurant>;
  loading: boolean;
  error: string | null;
  settingsForId: (id: string) => RestaurantSettings | null;
  createOrganization: (name: string) => Promise<ApiOrganization>;
  updateOrganization: (name: string) => Promise<ApiOrganization>;
  deleteOrganization: () => Promise<void>;
  createRestaurant: (input: Omit<CreateRestaurantInput, "organizationId">, modelId: string) => Promise<Restaurant>;
  deleteRestaurant: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

const toRestaurantSettings = (r: ApiRestaurant): RestaurantSettings => ({
  name: r.name,
  address: r.address,
  phone: r.phone,
  maxCovers: r.maxCovers,
  tableService: r.tableService,
  clickAndCollect: r.clickAndCollect,
  kitchenNotifications: r.kitchenNotifications,
  testMode: r.testMode
});

export function useApiRestaurants(): UseApiRestaurantsReturn {
  const { t } = useTranslation("common");
  const [user, setUser] = useState<ApiUser | null>(null);
  const [organization, setOrganization] = useState<ApiOrganization | null>(null);
  const [apiRestaurants, setApiRestaurants] = useState<ReadonlyArray<ApiRestaurant>>([]);
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

  const settingsForId = useCallback((id: string): RestaurantSettings | null => {
    const found = apiRestaurants.find((r) => r.id === id);

    return found ? toRestaurantSettings(found) : null;
  }, [apiRestaurants]);

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

  const updateOrganization = useCallback(async (name: string): Promise<ApiOrganization> => {
    if (!organization) throw new Error("Organization not loaded");
    try {
      const updated = await organizationsApi.update(organization.id, { name });

      setOrganization(updated);

      return updated;
    } catch (e) {
      const message = e instanceof Error ? e.message : t("errors.updateOrganizationFailed");

      toast.error(t("errors.updateOrganizationFailed"), { description: message });
      throw e;
    }
  }, [organization, t]);

  const deleteOrganization = useCallback(async (): Promise<void> => {
    if (!organization) throw new Error("Organization not loaded");
    try {
      await organizationsApi.delete(organization.id);
      setOrganization(null);
      setApiRestaurants([]);
    } catch (e) {
      const message = e instanceof Error ? e.message : t("errors.deleteOrganizationFailed");

      toast.error(t("errors.deleteOrganizationFailed"), { description: message });
      throw e;
    }
  }, [organization, t]);

  const deleteRestaurant = useCallback(async (id: string): Promise<void> => {
    try {
      await restaurantsApi.delete(id);
      restaurantModelsStorage.remove(id);
      setApiRestaurants((prev) => prev.filter((r) => r.id !== id));
      setModelMap(restaurantModelsStorage.getAll());
    } catch (e) {
      const message = e instanceof Error ? e.message : t("errors.deleteRestaurantFailed");

      toast.error(t("errors.deleteRestaurantFailed"), { description: message });
      throw e;
    }
  }, [t]);

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
    settingsForId,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    createRestaurant,
    deleteRestaurant,
    reload: load
  };
}
