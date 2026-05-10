import { useEffect } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { useRestaurantSelectionStore } from "@workspace/client";

const GroupRoute = (): null => {
  const selectGroup = useRestaurantSelectionStore((s) => s.selectGroup);

  useEffect(() => {
    selectGroup();
  }, [selectGroup]);

  return null;
};

export const Route = createFileRoute("/restaurants/group")({
  component: GroupRoute
});
