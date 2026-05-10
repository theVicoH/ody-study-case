import { create } from "zustand";

export type RestaurantSelection = string | "__group" | null;

export interface RestaurantSelectionState {
  selectedId: RestaurantSelection;
  secondaryId: string | null;
  compareMode: boolean;
  activeTab: string;
  secondaryTab: string | null;
  selectRestaurant: (id: string) => void;
  selectGroup: () => void;
  clearSelection: () => void;
  setActiveTab: (tab: string) => void;
  setSecondaryTab: (tab: string | null) => void;
  setCompareMode: (enabled: boolean) => void;
  toggleCompareMode: () => void;
  selectSecondaryRestaurant: (id: string) => void;
  openTabInSplit: (tab: string) => void;
}

const DEFAULT_TAB = "home";

export const useRestaurantSelectionStore = create<RestaurantSelectionState>((set) => ({
  selectedId: null,
  secondaryId: null,
  compareMode: false,
  activeTab: DEFAULT_TAB,
  secondaryTab: null,
  selectRestaurant: (id) => set({ selectedId: id }),
  selectGroup: () =>
    set({ selectedId: "__group", compareMode: false, secondaryId: null, secondaryTab: null }),
  clearSelection: () =>
    set({
      selectedId: null,
      activeTab: DEFAULT_TAB,
      compareMode: false,
      secondaryId: null,
      secondaryTab: null
    }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSecondaryTab: (tab) => set({ secondaryTab: tab }),
  setCompareMode: (enabled) =>
    set((s) => ({
      compareMode: enabled,
      secondaryTab: enabled ? s.secondaryTab : null
    })),
  toggleCompareMode: () =>
    set((s) => ({
      compareMode: !s.compareMode,
      secondaryTab: !s.compareMode ? s.secondaryTab : null
    })),
  selectSecondaryRestaurant: (id) => set({ secondaryId: id }),
  openTabInSplit: (tab) =>
    set((s) => {
      if (s.selectedId === null || s.selectedId === "__group") return s;
      if (s.compareMode) {
        return { secondaryTab: tab };
      }

      return {
        compareMode: true,
        secondaryId: s.secondaryId ?? s.selectedId,
        secondaryTab: tab
      };
    })
}));
