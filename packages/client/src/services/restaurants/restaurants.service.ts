import type {
  Restaurant,
  RestaurantCustomer,
  RestaurantDetailedStats,
  RestaurantMenuItem,
  RestaurantOrder,
  RestaurantSettings,
  RestaurantStats
} from "@/types/restaurant/restaurant.types";

const COLOR_AMBER = 0xffbf00;
const COLOR_PURPLE = 0x8442ff;
const COLOR_PINK = 0xff3eb5;

const MODEL_CORNER = "/models/corner-shop/scene.gltf";
const MODEL_JAPANESE_STREET = "/models/japanese-street-restaurant.gltf";
const MODEL_TEA = "/models/japanese-tea-shop/scene.gltf";
const MODEL_SUSHI = "/models/sushi-shop/scene.gltf";

const RESTAURANTS_CONFIG = {
  items: [
    {
      id: "r1",
      name: "Atelier Nord",
      type: "Atelier",
      address: "12 rue de Turenne, Paris 3e",
      performance: "good",
      shape: "box",
      position: { x: -8, z: -4 },
      dimensions: { width: 3.4, depth: 3.4, height: 2.8 },
      colors: { primary: COLOR_PURPLE, accent: COLOR_PINK },
      model: MODEL_CORNER
    },
    {
      id: "r2",
      name: "Maison Belleville",
      type: "Maison",
      address: "48 rue Ramponeau, Paris 20e",
      performance: "warn",
      shape: "tower",
      position: { x: 0, z: -6 },
      dimensions: { width: 3.0, depth: 4.2, height: 3.6 },
      colors: { primary: COLOR_PINK, accent: COLOR_AMBER },
      model: MODEL_JAPANESE_STREET
    },
    {
      id: "r3",
      name: "Le Comptoir d'Or",
      type: "Comptoir",
      address: "9 place du Marché, Lyon 1er",
      performance: "good",
      shape: "box",
      position: { x: 8, z: -3 },
      dimensions: { width: 3.6, depth: 3.0, height: 2.4 },
      colors: { primary: COLOR_AMBER, accent: COLOR_PINK },
      model: MODEL_TEA
    },
    {
      id: "r4",
      name: "Brasserie Rivoli",
      type: "Brasserie",
      address: "210 rue de Rivoli, Paris 1er",
      performance: "bad",
      shape: "wide",
      position: { x: -7, z: 4 },
      dimensions: { width: 4.0, depth: 3.2, height: 2.6 },
      colors: { primary: COLOR_PINK, accent: COLOR_PURPLE },
      model: MODEL_TEA
    },
    {
      id: "r5",
      name: "Café Lumière",
      type: "Café",
      address: "3 quai des Belges, Marseille",
      performance: "good",
      shape: "tower",
      position: { x: 1, z: 6 },
      dimensions: { width: 2.8, depth: 2.8, height: 3.2 },
      colors: { primary: COLOR_PURPLE, accent: COLOR_AMBER },
      model: MODEL_CORNER
    },
    {
      id: "r6",
      name: "Bistro Saint-Roch",
      type: "Bistro",
      address: "27 rue Saint-Roch, Bordeaux",
      performance: "warn",
      shape: "box",
      position: { x: 9, z: 5 },
      dimensions: { width: 3.2, depth: 3.0, height: 2.0 },
      colors: { primary: COLOR_AMBER, accent: COLOR_PURPLE },
      model: MODEL_JAPANESE_STREET
    }
  ]
} as const;

const RESTAURANTS: ReadonlyArray<Restaurant> = RESTAURANTS_CONFIG.items as ReadonlyArray<Restaurant>;

const STATS_SEED_MULTIPLIER = 31;
const STATS_SEED_RAND_A = 9301;
const STATS_SEED_RAND_C = 49297;
const STATS_SEED_RAND_M = 0xffffffff;
const STATS_SEED_DIVISOR = 1000;

const COVERS_BASE = 40;
const COVERS_RANGE = 90;
const REVENUE_BASE = 1200;
const REVENUE_RANGE = 3500;
const ORDERS_BASE = 4;
const ORDERS_RANGE = 12;
const RATING_BASE = 3.6;
const RATING_RANGE = 1.4;
const RATING_DIGITS = 1;

const TREND_GOOD = "+12%";
const TREND_WARN = "+2%";
const TREND_BAD = "−8%";

function createSeededRandom(id: string): () => number {
  let seed = 0;

  for (let i = 0; i < id.length; i++) {
    seed = (seed * STATS_SEED_MULTIPLIER + id.charCodeAt(i)) | 0;
  }

  return () => {
    seed = (seed * STATS_SEED_RAND_A + STATS_SEED_RAND_C) & STATS_SEED_RAND_M;

    return Math.abs(seed % STATS_SEED_DIVISOR) / STATS_SEED_DIVISOR;
  };
}

function trendForPerformance(restaurant: Restaurant): string {
  if (restaurant.performance === "good") return TREND_GOOD;
  if (restaurant.performance === "warn") return TREND_WARN;

  return TREND_BAD;
}

export function listRestaurants(): ReadonlyArray<Restaurant> {
  return RESTAURANTS;
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return RESTAURANTS.find((restaurant) => restaurant.id === id);
}

export function computeRestaurantStats(restaurant: Restaurant): RestaurantStats {
  const random = createSeededRandom(restaurant.id);
  const covers = COVERS_BASE + Math.floor(random() * COVERS_RANGE);
  const revenue = REVENUE_BASE + Math.floor(random() * REVENUE_RANGE);
  const orders = ORDERS_BASE + Math.floor(random() * ORDERS_RANGE);
  const rating = (RATING_BASE + random() * RATING_RANGE).toFixed(RATING_DIGITS);
  const trend = trendForPerformance(restaurant);

  return { covers, revenue, orders, rating, trend };
}

const CUSTOMER_BASE = 800;
const CUSTOMER_RANGE = 4500;
const OPEN_ORDERS_BASE = 4;
const OPEN_ORDERS_RANGE = 12;
const FILL_RATE_BASE = 62;
const FILL_RATE_RANGE = 30;
const WEEKLY_DAYS_COUNT = 7;
const WEEKLY_BASE_MULTIPLIER = 0.4;
const WEEKLY_RAND_MULTIPLIER = 0.6;
const WEEKLY_WEEKEND_BOOST = 0.15;
const WEEKLY_WEEKEND_START_INDEX = 4;
const MONTHS_COUNT = 12;
const MONTHLY_BASE_MULTIPLIER = 12;
const MONTHLY_RAND_MULTIPLIER = 8;
const MONTHLY_PEAK_INDEX = 11;
const MONTHLY_PEAK_BOOST = 4;
const MONTHLY_SUMMER_INDEX = 6;
const MONTHLY_SUMMER_BOOST = 2.5;
const YEARS_COUNT = 5;
const YEARLY_BASE_MULTIPLIER = 140;
const YEARLY_GROWTH_PER_YEAR = 18;
const YEARLY_RAND_MULTIPLIER = 35;
const HOURS_COUNT = 6;
const HEATMAP_PEAK_DAY_INDEX = 4;
const HEATMAP_PEAK_HOUR_EVENING = 4;
const HEATMAP_PEAK_HOUR_NIGHT = 5;
const HEATMAP_PEAK_INTENSITY = 0.4;
const HEATMAP_RAND_MULTIPLIER = 0.7;
const SPARKLINE_POINTS = 24;
const SPARKLINE_MIN = 0.2;
const SPARKLINE_RANGE = 0.8;
const CUSTOMER_VISITS_RANGE = 24;
const CUSTOMER_SPENT_BASE = 40;
const CUSTOMER_SPENT_RANGE = 800;
const ORDER_ID_BASE = 1024;
const ORDER_ID_RAND = 100;
const ORDER_TOTAL_PRECISION = 100;

const CUSTOMER_NAMES: ReadonlyArray<[string, string]> = [
  ["Camille", "Renaud"], ["Yannis", "Aït-Ahmed"], ["Léa", "Bertrand"], ["Hugo", "Vidal"],
  ["Margaux", "Petit"], ["Théo", "Da Silva"], ["Inès", "Marchand"], ["Noah", "Garnier"]
];
const CUSTOMER_TAGS: ReadonlyArray<RestaurantCustomer["tag"]> = ["VIP", "Regular", "New", "Regular", "VIP", "New", "Regular", "VIP"];

const ORDER_TABLES = [3, 7, 12, 4, 9, 1, 14, 6, 11, 8] as const;
const ORDER_STATUSES: ReadonlyArray<RestaurantOrder["status"]> = ["new", "preparing", "ready", "served", "paid"];
const ORDER_WHEN_LABELS = ["just now", "2m", "6m", "11m", "18m", "25m", "34m", "48m", "1h"] as const;

const ORDER_ITEMS_BASE = 2;
const ORDER_ITEMS_RANGE = 4;
const ORDER_TOTAL_BASE = 24;
const ORDER_TOTAL_RANGE = 90;

const DISH_NAMES = [
  "Tartare de bœuf", "Risotto aux cèpes", "Carpaccio de saumon",
  "Magret rosé", "Burrata maison", "Ravioles truffe",
  "Sole meunière", "Côte de bœuf", "Bœuf bourguignon",
  "Velouté de potimarron", "Foie gras maison", "Œuf parfait",
  "Saint-Jacques snackées", "Pizza margherita", "Burger gourmet",
  "Tagliatelles carbonara", "Lasagnes maison", "Poulet rôti",
  "Confit de canard", "Filet mignon", "Tartelette citron",
  "Fondant chocolat", "Tiramisu", "Crème brûlée",
  "Pavlova fruits rouges", "Salade César", "Soupe à l'oignon",
  "Quiche lorraine", "Plateau fromages", "Cocktail signature"
] as const;
const DISH_IMAGES = [
  "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565895405138-6c3a1555da6a?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1432139438709-fac80d115b75?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1452251889946-8ff5ea7b27ab?w=400&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80&auto=format&fit=crop"
] as const;
const DISH_CATEGORIES = ["Entrées", "Plats", "Desserts", "Boissons", "Carte du jour"] as const;
const MENU_PRICE_BASE = 12;
const MENU_PRICE_RANGE = 32;
const MENU_AVAILABLE_THRESHOLD = 0.18;
const TOP_ITEMS_SOLD_BASE = 180;
const TOP_ITEMS_SOLD_STEP = 22;

export function computeRestaurantDetailedStats(restaurant: Restaurant): RestaurantDetailedStats {
  const base = computeRestaurantStats(restaurant);
  const rng = createSeededRandom(restaurant.id + "_detail");

  const todayCovers = COVERS_BASE + Math.floor(rng() * COVERS_RANGE);
  const todayRevenue = REVENUE_BASE + Math.floor(rng() * REVENUE_RANGE);
  const avgTicket = Math.round(todayRevenue / Math.max(1, todayCovers));
  const fillRate = FILL_RATE_BASE + Math.floor(rng() * FILL_RATE_RANGE);
  const customers = CUSTOMER_BASE + Math.floor(rng() * CUSTOMER_RANGE);
  const openOrders = OPEN_ORDERS_BASE + Math.floor(rng() * OPEN_ORDERS_RANGE);

  const weeklyRng = createSeededRandom(restaurant.id + "_weekly");
  const weeklyRevenue = Array.from({ length: WEEKLY_DAYS_COUNT }, (_, i) => {
    const weekend = i >= WEEKLY_WEEKEND_START_INDEX ? WEEKLY_WEEKEND_BOOST : 0;

    return Math.round((WEEKLY_BASE_MULTIPLIER + weeklyRng() * WEEKLY_RAND_MULTIPLIER + weekend) * todayRevenue);
  });

  const monthlyRng = createSeededRandom(restaurant.id + "_monthly");
  const monthlyRevenue = Array.from({ length: MONTHS_COUNT }, (_, i) => {
    const peakBoost = i === MONTHLY_PEAK_INDEX ? MONTHLY_PEAK_BOOST : 0;
    const summerBoost = i === MONTHLY_SUMMER_INDEX ? MONTHLY_SUMMER_BOOST : 0;

    return Math.round((MONTHLY_BASE_MULTIPLIER + monthlyRng() * MONTHLY_RAND_MULTIPLIER + peakBoost + summerBoost) * todayRevenue);
  });

  const yearlyRng = createSeededRandom(restaurant.id + "_yearly");
  const yearlyRevenue = Array.from({ length: YEARS_COUNT }, (_, i) => {
    const growth = i * YEARLY_GROWTH_PER_YEAR;

    return Math.round((YEARLY_BASE_MULTIPLIER + growth + yearlyRng() * YEARLY_RAND_MULTIPLIER) * todayRevenue);
  });

  const heatmapRng = createSeededRandom(restaurant.id + "_heatmap");
  const heatmap: ReadonlyArray<ReadonlyArray<number>> = Array.from({ length: HOURS_COUNT }, (_, hi) => Array.from({ length: WEEKLY_DAYS_COUNT }, (__, di) => {
    const rawValue = heatmapRng();
    const isPeakSlot = di >= HEATMAP_PEAK_DAY_INDEX
      && (hi === HEATMAP_PEAK_HOUR_EVENING || hi === HEATMAP_PEAK_HOUR_NIGHT);
    const peak = isPeakSlot ? HEATMAP_PEAK_INTENSITY : 0;

    return Math.min(1, rawValue * HEATMAP_RAND_MULTIPLIER + peak);
  }));

  const sparklineRng = createSeededRandom(restaurant.id + "_spark");
  const sparklineData = Array.from(
    { length: SPARKLINE_POINTS },
    () => SPARKLINE_MIN + sparklineRng() * SPARKLINE_RANGE
  );

  const topRng = createSeededRandom(restaurant.id + "_top");
  const topItems = DISH_NAMES.slice(0, 5).map((name, i) => ({
    name,
    category: DISH_CATEGORIES[i % DISH_CATEGORIES.length],
    price: MENU_PRICE_BASE + Math.floor(topRng() * MENU_PRICE_RANGE),
    sold: TOP_ITEMS_SOLD_BASE - i * TOP_ITEMS_SOLD_STEP
  }));

  return {
    ...base,
    todayCovers,
    todayRevenue,
    avgTicket,
    fillRate,
    customers,
    openOrders,
    weeklyRevenue,
    monthlyRevenue,
    yearlyRevenue,
    heatmap,
    sparklineData,
    topItems
  };
}

export function listRestaurantCustomers(restaurant: Restaurant): ReadonlyArray<RestaurantCustomer> {
  const rng = createSeededRandom(restaurant.id + "_crm");

  return CUSTOMER_NAMES.map(([first, last], i) => ({
    id: `${restaurant.id}_c${i}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase().replace(/\W/g, "")}@mail.com`,
    visits: 1 + Math.floor(rng() * CUSTOMER_VISITS_RANGE),
    spent: Math.round(CUSTOMER_SPENT_BASE + rng() * CUSTOMER_SPENT_RANGE),
    tag: CUSTOMER_TAGS[i]
  }));
}

export function listRestaurantOrders(restaurant: Restaurant): ReadonlyArray<RestaurantOrder> {
  const rng = createSeededRandom(restaurant.id + "_orders");

  return Array.from({ length: 40 }, (_, i) => ({
    id: `#${ORDER_ID_BASE + i + Math.floor(rng() * ORDER_ID_RAND)}`,
    table: ORDER_TABLES[i % ORDER_TABLES.length],
    items: ORDER_ITEMS_BASE + Math.floor(rng() * ORDER_ITEMS_RANGE),
    total: Math.round((ORDER_TOTAL_BASE + rng() * ORDER_TOTAL_RANGE) * ORDER_TOTAL_PRECISION) / ORDER_TOTAL_PRECISION,
    status: ORDER_STATUSES[Math.floor(rng() * ORDER_STATUSES.length)],
    when: ORDER_WHEN_LABELS[i % ORDER_WHEN_LABELS.length]
  }));
}

export function listRestaurantMenuItems(restaurant: Restaurant): ReadonlyArray<RestaurantMenuItem> {
  const rng = createSeededRandom(restaurant.id + "_menu");

  return DISH_NAMES.map((name, i) => ({
    id: `${restaurant.id}_m${i}`,
    name,
    category: DISH_CATEGORIES[i % DISH_CATEGORIES.length],
    price: MENU_PRICE_BASE + Math.floor(rng() * MENU_PRICE_RANGE),
    available: rng() > MENU_AVAILABLE_THRESHOLD,
    image: DISH_IMAGES[i % DISH_IMAGES.length]
  }));
}

export function getRestaurantSettings(restaurant: Restaurant): RestaurantSettings {
  return {
    name: restaurant.name,
    address: restaurant.address,
    phone: "+33 1 42 18 30 22",
    maxCovers: 84,
    tableService: true,
    clickAndCollect: true,
    kitchenNotifications: false,
    testMode: false
  };
}
