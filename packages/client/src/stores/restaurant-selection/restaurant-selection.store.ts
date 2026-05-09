import { create } from "zustand";

export type RestaurantSelection = string | "__group" | null;

export interface RestaurantSelectionState {
  selectedId: RestaurantSelection;
  activeTab: string;
  selectRestaurant: (id: string) => void;
  selectGroup: () => void;
  clearSelection: () => void;
  setActiveTab: (tab: string) => void;
}

const DEFAULT_TAB = "home";

export const useRestaurantSelectionStore = create<RestaurantSelectionState>((set) => ({
  selectedId: null,
  activeTab: DEFAULT_TAB,
  selectRestaurant: (id) => set({ selectedId: id }),
  selectGroup: () => set({ selectedId: "__group" }),
  clearSelection: () => set({ selectedId: null, activeTab: DEFAULT_TAB }),
  setActiveTab: (tab) => set({ activeTab: tab })
}));
