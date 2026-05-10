export interface RestaurantModelDef {
  id: string;
  label: string;
  url: string;
  thumbnail: string;
}

export const RESTAURANT_MODELS: ReadonlyArray<RestaurantModelDef> = [
  {
    id: "corner-shop",
    label: "Corner Shop",
    url: "/models/corner-shop/scene.gltf",
    thumbnail: "/models/corner-shop/screenshot/screenshot.png"
  },
  {
    id: "japanese-street",
    label: "Japanese Street",
    url: "/models/japanese-street-restaurant.gltf",
    thumbnail: "/models/japanese-street-restaurant.gltf#preview"
  },
  {
    id: "japanese-tea-shop",
    label: "Japanese Tea Shop",
    url: "/models/japanese-tea-shop/scene.gltf",
    thumbnail: "/models/japanese-tea-shop/screenshot/screenshot.png"
  }
];

export const DEFAULT_MODEL_ID = RESTAURANT_MODELS[0]?.id ?? "corner-shop";

export const findModelById = (id: string): RestaurantModelDef => {
  return RESTAURANT_MODELS.find((m) => m.id === id) ?? RESTAURANT_MODELS[0]!;
};
