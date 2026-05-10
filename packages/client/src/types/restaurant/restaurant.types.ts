export type RestaurantPerformance = "good" | "warn" | "bad";

export type RestaurantShape = "box" | "tower" | "wide";

export interface RestaurantPosition {
  x: number;
  z: number;
}

export interface RestaurantDimensions {
  width: number;
  depth: number;
  height: number;
}

export interface RestaurantColors {
  primary: number;
  accent: number;
}

export interface Restaurant {
  id: string;
  name: string;
  type: string;
  address: string;
  performance: RestaurantPerformance;
  shape: RestaurantShape;
  position: RestaurantPosition;
  dimensions: RestaurantDimensions;
  colors: RestaurantColors;
  model: string;
}

export interface RestaurantStats {
  covers: number;
  revenue: number;
  orders: number;
  rating: string;
  trend: string;
}

export type CustomerTag = "VIP" | "Regular" | "New";

export interface RestaurantCustomer {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  visits: number;
  spent: number;
  tag: CustomerTag;
}

export type OrderStatus = "new" | "preparing" | "ready" | "served" | "paid";

export interface RestaurantOrder {
  id: string;
  table: number;
  items: number;
  total: number;
  status: OrderStatus;
  when: string;
}

export interface RestaurantMenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image: string;
  kind?: "dish" | "menu";
}

export interface RestaurantTopItem {
  name: string;
  category: string;
  price: number;
  sold: number;
}

export interface RestaurantDetailedStats extends RestaurantStats {
  todayCovers: number;
  todayRevenue: number;
  avgTicket: number;
  fillRate: number;
  weeklyRevenue: ReadonlyArray<number>;
  monthlyRevenue: ReadonlyArray<number>;
  yearlyRevenue: ReadonlyArray<number>;
  heatmap: ReadonlyArray<ReadonlyArray<number>>;
  topItems: ReadonlyArray<RestaurantTopItem>;
  sparklineData: ReadonlyArray<number>;
  customers: number;
  openOrders: number;
}

export interface RestaurantSettings {
  name: string;
  address: string;
  phone: string;
  maxCovers: number;
  tableService: boolean;
  clickAndCollect: boolean;
  kitchenNotifications: boolean;
  testMode: boolean;
}

export type TableZone = "salle" | "terrasse" | "bar" | "vip";

export type TableStatus = "available" | "occupied" | "reserved";

export interface RestaurantTable {
  id: string;
  number: number;
  capacity: number;
  zone: TableZone;
  status: TableStatus;
}
