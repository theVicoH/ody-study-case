import type {
  Restaurant,
  RestaurantColors,
  RestaurantDimensions,
  RestaurantPerformance,
  RestaurantPosition,
  RestaurantShape
} from "@/types/restaurant/restaurant.types";

import { findModelById } from "@/lib/restaurant-visuals/restaurant-models.constant";

const COLOR_AMBER = 0xffbf00;
const COLOR_PURPLE = 0x8442ff;
const COLOR_PINK = 0xff3eb5;

const SHAPES: ReadonlyArray<RestaurantShape> = ["box", "tower", "wide"];
const PERFORMANCES: ReadonlyArray<RestaurantPerformance> = ["good", "warn", "bad"];
const COLOR_PAIRS: ReadonlyArray<RestaurantColors> = [
  { primary: COLOR_PURPLE, accent: COLOR_PINK },
  { primary: COLOR_PINK, accent: COLOR_AMBER },
  { primary: COLOR_AMBER, accent: COLOR_PINK },
  { primary: COLOR_AMBER, accent: COLOR_PURPLE },
  { primary: COLOR_PURPLE, accent: COLOR_AMBER },
  { primary: COLOR_PINK, accent: COLOR_PURPLE }
];

const ORBIT_RADIUS = 9;
const HEIGHT_MIN = 2.0;
const HEIGHT_RANGE = 1.6;
const WIDTH_MIN = 2.8;
const WIDTH_RANGE = 1.4;
const TWO_PI = Math.PI * 2;
const HASH_BUCKET = 100;
const HASH_HALF = 0.5;
const ROUND_FACTOR = 100;
const HASH_BIT_SHIFT_4 = 4;
const HASH_BIT_SHIFT_8 = 8;
const HASH_SHIFT = 5;
const WOBBLE_RANGE = 0.5;

function hashId(id: string): number {
  let hash = 0;

  for (let i = 0; i < id.length; i += 1) {
    hash = ((hash << HASH_SHIFT) - hash + id.charCodeAt(i)) | 0;
  }

  return Math.abs(hash);
}

function pick<T>(list: ReadonlyArray<T>, hash: number, salt: number): T {
  return list[(hash + salt) % list.length] as T;
}

interface ApiRestaurantLike {
  id: string;
  name: string;
}

const JAPANESE_KEYWORDS = ["sushi", "japan", "ramen", "izakaya", "nippon", "zen"];
const ITALIAN_KEYWORDS = ["pizza", "italia", "roma", "trattoria", "pasta"];
const FRENCH_KEYWORDS = ["bistrot", "bistro", "brasserie", "parisien", "français", "francais"];
const ALL_MODEL_IDS = ["corner-shop", "japanese-street", "japanese-tea-shop"] as const;

function defaultModelForRestaurant(name: string, id: string): string {
  const lower = name.toLowerCase();

  if (JAPANESE_KEYWORDS.some((k) => lower.includes(k))) return "japanese-tea-shop";
  if (ITALIAN_KEYWORDS.some((k) => lower.includes(k))) return "corner-shop";
  if (FRENCH_KEYWORDS.some((k) => lower.includes(k))) return "japanese-street";

  return ALL_MODEL_IDS[hashId(id) % ALL_MODEL_IDS.length]!;
}

export interface VisualOverrides {
  modelId?: string;
}

export function deriveRestaurantPosition(id: string, index: number, total: number): RestaurantPosition {
  const angle = total > 0 ? (index / total) * TWO_PI : 0;
  const wobble = ((hashId(id) % HASH_BUCKET) / HASH_BUCKET - HASH_HALF) * WOBBLE_RANGE;
  const radius = ORBIT_RADIUS + wobble;

  return {
    x: Math.round(Math.cos(angle) * radius * ROUND_FACTOR) / ROUND_FACTOR,
    z: Math.round(Math.sin(angle) * radius * ROUND_FACTOR) / ROUND_FACTOR
  };
}

export function deriveRestaurantDimensions(id: string): RestaurantDimensions {
  const hash = hashId(id);
  const width = Math.round((WIDTH_MIN + ((hash % HASH_BUCKET) / HASH_BUCKET) * WIDTH_RANGE) * ROUND_FACTOR) / ROUND_FACTOR;
  const depth = Math.round((WIDTH_MIN + (((hash >> HASH_BIT_SHIFT_4) % HASH_BUCKET) / HASH_BUCKET) * WIDTH_RANGE) * ROUND_FACTOR) / ROUND_FACTOR;
  const height = Math.round((HEIGHT_MIN + (((hash >> HASH_BIT_SHIFT_8) % HASH_BUCKET) / HASH_BUCKET) * HEIGHT_RANGE) * ROUND_FACTOR) / ROUND_FACTOR;

  return { width, depth, height };
}

export function deriveRestaurantShape(id: string): RestaurantShape {
  return pick(SHAPES, hashId(id), 0);
}

export function deriveRestaurantPerformance(id: string): RestaurantPerformance {
  return pick(PERFORMANCES, hashId(id), 1);
}

export function deriveRestaurantColors(id: string): RestaurantColors {
  return pick(COLOR_PAIRS, hashId(id), 0);
}

export function toVisualRestaurant(
  api: ApiRestaurantLike & { address: string },
  index: number,
  total: number,
  overrides: VisualOverrides = {}
): Restaurant {
  const overrideValid = overrides.modelId && ALL_MODEL_IDS.includes(overrides.modelId as typeof ALL_MODEL_IDS[number]);
  const modelId = overrideValid ? overrides.modelId! : defaultModelForRestaurant(api.name, api.id);
  const model = findModelById(modelId);

  return {
    id: api.id,
    name: api.name,
    type: "Restaurant",
    address: api.address,
    performance: deriveRestaurantPerformance(api.id),
    shape: deriveRestaurantShape(api.id),
    position: deriveRestaurantPosition(api.id, index, total),
    dimensions: deriveRestaurantDimensions(api.id),
    colors: deriveRestaurantColors(api.id),
    model: model.url
  };
}
