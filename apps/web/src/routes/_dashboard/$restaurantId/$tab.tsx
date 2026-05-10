import { useEffect } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { useRestaurantSelectionStore } from "@workspace/client";

const VALID_TABS = new Set(["home", "stats", "crm", "orders", "settings"]);

const RestaurantTabRoute = (): null => {
  const { restaurantId, tab } = Route.useParams();
  const selectRestaurant = useRestaurantSelectionStore((s) => s.selectRestaurant);
  const setActiveTab = useRestaurantSelectionStore((s) => s.setActiveTab);

  useEffect(() => {
    selectRestaurant(restaurantId);
    setActiveTab(VALID_TABS.has(tab) ? tab : "home");
  }, [restaurantId, tab, selectRestaurant, setActiveTab]);

  return null;
};

export const Route = createFileRoute("/_dashboard/$restaurantId/$tab")({
  component: RestaurantTabRoute
});
