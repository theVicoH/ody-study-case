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

function hashId(id: string): number {
  let hash = 0;

  for (let i = 0; i < id.length; i += 1) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
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

export interface VisualOverrides {
  modelId?: string;
}

export function deriveRestaurantPosition(id: string, index: number, total: number): RestaurantPosition {
  const angle = total > 0 ? (index / total) * TWO_PI : 0;
  const wobble = ((hashId(id) % 100) / 100 - 0.5) * 0.5;
  const radius = ORBIT_RADIUS + wobble;

  return {
    x: Math.round(Math.cos(angle) * radius * 100) / 100,
    z: Math.round(Math.sin(angle) * radius * 100) / 100
  };
}

export function deriveRestaurantDimensions(id: string): RestaurantDimensions {
  const hash = hashId(id);
  const width = Math.round((WIDTH_MIN + ((hash % 100) / 100) * WIDTH_RANGE) * 100) / 100;
  const depth = Math.round((WIDTH_MIN + (((hash >> 4) % 100) / 100) * WIDTH_RANGE) * 100) / 100;
  const height = Math.round((HEIGHT_MIN + (((hash >> 8) % 100) / 100) * HEIGHT_RANGE) * 100) / 100;

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
  const model = findModelById(overrides.modelId ?? "corner-shop");

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
