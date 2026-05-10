import type { Restaurant } from "@workspace/client";

export interface RestaurantSceneCallbacks {
  onSelectGroup?: () => void;
  onSelectRestaurant?: (restaurant: Restaurant) => void;
  onEmptyClick?: () => void;
  onSunClick?: () => void;
}

export interface RestaurantSceneApi {
  selectRestaurant: (id: string | null) => void;
  focusRestaurant: (id: string) => void;
  setSunVisible: (visible: boolean) => void;
  resetCamera: () => void;
  dispose: () => void;
}
