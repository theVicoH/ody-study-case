import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useRestaurantSelectionStore } from "@/stores/restaurant-selection/restaurant-selection.store";

describe("restaurant selection store", () => {
  beforeEach(() => {
    act(() => useRestaurantSelectionStore.getState().clearSelection());
  });

  it("starts with no selection", () => {
    expect(useRestaurantSelectionStore.getState().selectedId).toBeNull();
  });

  it("selects a restaurant by id", () => {
    act(() => useRestaurantSelectionStore.getState().selectRestaurant("r1"));

    expect(useRestaurantSelectionStore.getState().selectedId).toBe("r1");
  });

  it("supports selecting the group", () => {
    act(() => useRestaurantSelectionStore.getState().selectGroup());

    expect(useRestaurantSelectionStore.getState().selectedId).toBe("__group");
  });

  it("clears selection and resets active tab", () => {
    act(() => useRestaurantSelectionStore.getState().selectRestaurant("r1"));
    act(() => useRestaurantSelectionStore.getState().setActiveTab("stats"));
    act(() => useRestaurantSelectionStore.getState().clearSelection());

    expect(useRestaurantSelectionStore.getState().selectedId).toBeNull();
    expect(useRestaurantSelectionStore.getState().activeTab).toBe("home");
  });

  it("changes active tab", () => {
    act(() => useRestaurantSelectionStore.getState().setActiveTab("crm"));

    expect(useRestaurantSelectionStore.getState().activeTab).toBe("crm");
  });

  it("opens a tab in split view from a single sheet", () => {
    act(() => useRestaurantSelectionStore.getState().selectRestaurant("r1"));
    act(() => useRestaurantSelectionStore.getState().openTabInSplit("orders"));

    const s = useRestaurantSelectionStore.getState();

    expect(s.compareMode).toBe(true);
    expect(s.secondaryId).toBe("r1");
    expect(s.secondaryTab).toBe("orders");
  });

  it("updates only secondary tab when already in split", () => {
    act(() => useRestaurantSelectionStore.getState().selectRestaurant("r1"));
    act(() => useRestaurantSelectionStore.getState().openTabInSplit("orders"));
    act(() => useRestaurantSelectionStore.getState().selectSecondaryRestaurant("r2"));
    act(() => useRestaurantSelectionStore.getState().openTabInSplit("crm"));

    const s = useRestaurantSelectionStore.getState();

    expect(s.compareMode).toBe(true);
    expect(s.secondaryId).toBe("r2");
    expect(s.secondaryTab).toBe("crm");
  });

  it("clears secondary tab when leaving compare mode", () => {
    act(() => useRestaurantSelectionStore.getState().selectRestaurant("r1"));
    act(() => useRestaurantSelectionStore.getState().openTabInSplit("orders"));
    act(() => useRestaurantSelectionStore.getState().setCompareMode(false));

    expect(useRestaurantSelectionStore.getState().secondaryTab).toBeNull();
  });
});
