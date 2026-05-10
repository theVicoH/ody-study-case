import "../src/env-config";

import {
  clientsTable,
  db,
  dishesTable,
  menuDishesTable,
  menusTable,
  orderItemsTable,
  ordersTable,
  ORDER_STATUS,
  organizationsTable,
  restaurantOpeningHoursTable,
  restaurantTablesTable,
  restaurantsTable,
  usersTable
} from "@workspace/database";
import { eq } from "drizzle-orm";

import { auth } from "../src/lib/auth/auth";

import type { OrderStatus } from "@workspace/database";

const DEMO_EMAIL = "demo@gmail.com";
const DEMO_PASSWORD = "Demo1234!";

interface DishSeed {
  name: string;
  description: string;
  priceCents: number;
  category: string;
}

interface MenuSeed {
  name: string;
  description: string;
  priceCents: number;
  dishNames: string[];
}

interface RestaurantSeed {
  name: string;
  address: string;
  phone: string;
  maxCovers: number;
  dishes: DishSeed[];
  menus: MenuSeed[];
}

const RESTAURANTS: RestaurantSeed[] = [
  {
    name: "Le Bistrot Parisien",
    address: "12 rue de Rivoli, 75004 Paris",
    phone: "+33142781234",
    maxCovers: 60,
    dishes: [
      { name: "Soupe à l'oignon", description: "Soupe gratinée à l'ancienne", priceCents: 950, category: "starter" },
      { name: "Foie gras maison", description: "Foie gras mi-cuit, chutney de figues", priceCents: 1850, category: "starter" },
      { name: "Œuf mayonnaise", description: "Œuf dur sauce mayonnaise maison", priceCents: 650, category: "starter" },
      { name: "Salade de chèvre chaud", description: "Toasts de chèvre, miel, noix", priceCents: 1250, category: "starter" },
      { name: "Bœuf bourguignon", description: "Mijoté de bœuf au vin rouge", priceCents: 2250, category: "main" },
      { name: "Confit de canard", description: "Cuisse confite, pommes sarladaises", priceCents: 2450, category: "main" },
      { name: "Steak frites", description: "Entrecôte 250g, frites maison", priceCents: 2650, category: "main" },
      { name: "Blanquette de veau", description: "Riz basmati, légumes anciens", priceCents: 2150, category: "main" },
      { name: "Poulet rôti", description: "Demi-poulet fermier, jus au thym", priceCents: 1950, category: "main" },
      { name: "Crème brûlée", description: "Vanille de Madagascar", priceCents: 850, category: "dessert" },
      { name: "Tarte Tatin", description: "Pommes caramélisées, glace vanille", priceCents: 950, category: "dessert" },
      { name: "Mousse au chocolat", description: "Chocolat noir 70%", priceCents: 750, category: "dessert" },
      { name: "Profiteroles", description: "Choux, glace vanille, chocolat chaud", priceCents: 950, category: "dessert" },
      { name: "Vin rouge - Bordeaux", description: "Verre 12cl", priceCents: 650, category: "drink" },
      { name: "Eau pétillante", description: "Badoit 50cl", priceCents: 450, category: "drink" }
    ],
    menus: [
      {
        name: "Menu Déjeuner",
        description: "Entrée + Plat + Dessert",
        priceCents: 2890,
        dishNames: ["Œuf mayonnaise", "Steak frites", "Crème brûlée"]
      },
      {
        name: "Menu Tradition",
        description: "Le meilleur de la cuisine française",
        priceCents: 4290,
        dishNames: ["Foie gras maison", "Confit de canard", "Tarte Tatin"]
      },
      {
        name: "Menu Express",
        description: "Plat + Dessert servi en 30min",
        priceCents: 2290,
        dishNames: ["Poulet rôti", "Mousse au chocolat"]
      }
    ]
  },
  {
    name: "Sushi Zen",
    address: "45 avenue Montaigne, 75008 Paris",
    phone: "+33145623789",
    maxCovers: 40,
    dishes: [
      { name: "Edamame", description: "Fèves de soja au sel", priceCents: 550, category: "starter" },
      { name: "Soupe miso", description: "Tofu, wakamé, oignons verts", priceCents: 450, category: "starter" },
      { name: "Gyoza poulet", description: "6 raviolis poêlés", priceCents: 850, category: "starter" },
      { name: "Salade wakamé", description: "Algues marinées sésame", priceCents: 750, category: "starter" },
      { name: "Sashimi saumon (8 pcs)", description: "Saumon frais", priceCents: 1650, category: "main" },
      { name: "Sashimi thon (8 pcs)", description: "Thon rouge", priceCents: 1850, category: "main" },
      { name: "Maki California (8 pcs)", description: "Surimi, avocat, concombre", priceCents: 1250, category: "main" },
      { name: "Maki saumon (6 pcs)", description: "Saumon, riz vinaigré", priceCents: 1050, category: "main" },
      { name: "Chirashi saumon", description: "Bol de riz, saumon, légumes", priceCents: 1950, category: "main" },
      { name: "Ramen tonkotsu", description: "Bouillon porc, nouilles, œuf", priceCents: 1650, category: "main" },
      { name: "Mochi glacé", description: "Trio matcha, vanille, chocolat", priceCents: 750, category: "dessert" },
      { name: "Dorayaki", description: "Pancake fourré haricot rouge", priceCents: 650, category: "dessert" },
      { name: "Saké chaud", description: "30cl", priceCents: 850, category: "drink" },
      { name: "Thé vert", description: "Sencha bio", priceCents: 350, category: "drink" }
    ],
    menus: [
      {
        name: "Menu Bento",
        description: "Soupe + Maki + Dessert",
        priceCents: 2490,
        dishNames: ["Soupe miso", "Maki saumon (6 pcs)", "Mochi glacé"]
      },
      {
        name: "Menu Découverte",
        description: "L'expérience japonaise complète",
        priceCents: 3890,
        dishNames: ["Gyoza poulet", "Sashimi saumon (8 pcs)", "Dorayaki"]
      }
    ]
  },
  {
    name: "Pizza Roma",
    address: "8 rue des Lombards, 75004 Paris",
    phone: "+33142339876",
    maxCovers: 50,
    dishes: [
      { name: "Bruschetta tomate", description: "Pain grillé, tomate, basilic", priceCents: 750, category: "starter" },
      { name: "Antipasti", description: "Charcuterie, fromages, légumes grillés", priceCents: 1450, category: "starter" },
      { name: "Burrata", description: "Burrata des Pouilles, roquette", priceCents: 1250, category: "starter" },
      { name: "Pizza Margherita", description: "Tomate, mozzarella, basilic", priceCents: 1290, category: "main" },
      { name: "Pizza Regina", description: "Tomate, mozzarella, jambon, champignons", priceCents: 1490, category: "main" },
      { name: "Pizza Quattro Formaggi", description: "Mozza, gorgonzola, parmesan, chèvre", priceCents: 1590, category: "main" },
      { name: "Pizza Diavola", description: "Tomate, mozza, salami piquant", priceCents: 1490, category: "main" },
      { name: "Pizza Vegetariana", description: "Légumes grillés, mozzarella", priceCents: 1390, category: "main" },
      { name: "Lasagnes maison", description: "Bolognaise, béchamel", priceCents: 1650, category: "main" },
      { name: "Spaghetti carbonara", description: "Œuf, guanciale, pecorino", priceCents: 1450, category: "main" },
      { name: "Tiramisu", description: "Mascarpone, café, cacao", priceCents: 750, category: "dessert" },
      { name: "Panna cotta", description: "Coulis fruits rouges", priceCents: 650, category: "dessert" },
      { name: "Vin rouge - Chianti", description: "Verre 12cl", priceCents: 550, category: "drink" }
    ],
    menus: [
      {
        name: "Menu Pizza",
        description: "Antipasti + Pizza + Dessert",
        priceCents: 2490,
        dishNames: ["Bruschetta tomate", "Pizza Margherita", "Tiramisu"]
      },
      {
        name: "Menu Italiano",
        description: "Le grand classique",
        priceCents: 3290,
        dishNames: ["Burrata", "Lasagnes maison", "Panna cotta"]
      }
    ]
  }
];

const FIRST_NAMES = ["Lucas", "Emma", "Hugo", "Léa", "Louis", "Chloé", "Jules", "Alice", "Gabriel", "Manon",
  "Adam", "Inès", "Raphaël", "Sarah", "Arthur", "Camille", "Nathan", "Louise", "Maxime", "Jade",
  "Théo", "Zoé", "Antoine", "Eva", "Paul", "Lola", "Tom", "Romane", "Léo", "Anna"];
const LAST_NAMES = ["Martin", "Bernard", "Dubois", "Thomas", "Robert", "Petit", "Durand", "Leroy",
  "Moreau", "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David", "Bertrand", "Roux", "Vincent",
  "Fournier", "Morel", "Girard", "Andre", "Mercier", "Boyer", "Blanc", "Guerin", "Muller", "Henry"];
const TAGS = ["VIP", "Régulier", "New", "Famille", "Affaires"];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pickStatus(): OrderStatus {
  const r = Math.random();
  if (r < 0.45) return ORDER_STATUS.PAID;
  if (r < 0.6) return ORDER_STATUS.SERVED;
  if (r < 0.75) return ORDER_STATUS.READY;
  if (r < 0.88) return ORDER_STATUS.PREPARING;
  if (r < 0.95) return ORDER_STATUS.PENDING;

  return ORDER_STATUS.CANCELLED;
}

function randomDateWithinDays(days: number): Date {
  const now = Date.now();
  const past = now - Math.floor(Math.random() * days * 24 * 60 * 60 * 1000);

  return new Date(past);
}

async function cleanup(): Promise<void> {
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, DEMO_EMAIL));

  if (existing.length === 0) {
    return;
  }

  const userId = existing[0]!.id;

  console.log(`Removing existing demo user ${userId} and all its data...`);

  const orgs = await db.select().from(organizationsTable).where(eq(organizationsTable.ownerId, userId));

  for (const org of orgs) {
    await db.delete(organizationsTable).where(eq(organizationsTable.id, org.id));
  }

  await db.delete(usersTable).where(eq(usersTable.id, userId));
}

async function createDemoUser(): Promise<string> {
  const result = await auth.api.signUpEmail({
    body: {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      name: "Demo User",
      firstName: "Demo",
      lastName: "User",
      birthday: new Date("1995-06-15T00:00:00.000Z")
    } as never
  });

  console.log(`Created demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);

  return result.user.id;
}

async function seedRestaurant(restaurantId: string, seed: RestaurantSeed): Promise<void> {
  const openingHours = Array.from({ length: 7 }, (_, day) => ({
    restaurantId,
    dayOfWeek: day,
    isOpen: day !== 0,
    openTime: "12:00",
    closeTime: "23:00"
  }));

  await db.insert(restaurantOpeningHoursTable).values(openingHours);

  const tableCount = 8 + Math.floor(Math.random() * 5);
  const tables = Array.from({ length: tableCount }, (_, i) => ({
    id: crypto.randomUUID(),
    restaurantId,
    number: i + 1,
    name: `Table ${i + 1}`,
    capacity: 2 + (i % 3) * 2,
    zone: i < tableCount - 2 ? "salle" : "terrasse",
    status: "available",
    isActive: true
  }));

  await db.insert(restaurantTablesTable).values(tables);

  const dishRows = seed.dishes.map((d) => ({
    id: crypto.randomUUID(),
    restaurantId,
    name: d.name,
    description: d.description,
    priceCents: d.priceCents,
    category: d.category,
    isActive: true
  }));

  await db.insert(dishesTable).values(dishRows);

  const dishByName = new Map(dishRows.map((d) => [d.name, d]));

  for (const menuSeed of seed.menus) {
    const menuId = crypto.randomUUID();

    await db.insert(menusTable).values({
      id: menuId,
      restaurantId,
      name: menuSeed.name,
      description: menuSeed.description,
      priceCents: menuSeed.priceCents,
      isActive: true
    });

    const menuDishRows = menuSeed.dishNames
      .map((name, position) => {
        const dish = dishByName.get(name);

        return dish ? { menuId, dishId: dish.id, position } : null;
      })
      .filter((row): row is { menuId: string; dishId: string; position: number } => row !== null);

    if (menuDishRows.length > 0) {
      await db.insert(menuDishesTable).values(menuDishRows);
    }
  }

  const clientCount = 20 + Math.floor(Math.random() * 11);
  const clientRows = Array.from({ length: clientCount }, (_, i) => {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);

    return {
      id: crypto.randomUUID(),
      restaurantId,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@demo.local`,
      phone: `+3361234${String(1000 + i).padStart(4, "0")}`,
      notes: Math.random() > 0.7 ? "Allergique aux fruits de mer" : null,
      tag: pick(TAGS)
    };
  });

  await db.insert(clientsTable).values(clientRows);

  const allDishes = dishRows;
  const orderCount = 50;

  for (let i = 0; i < orderCount; i++) {
    const orderId = crypto.randomUUID();
    const status = pickStatus();
    const placedAt = randomDateWithinDays(45);
    const useClient = Math.random() > 0.3;
    const useTable = Math.random() > 0.2;
    const itemCount = 1 + Math.floor(Math.random() * 4);

    const items = Array.from({ length: itemCount }, () => {
      const dish = pick(allDishes);
      const quantity = 1 + Math.floor(Math.random() * 3);

      return {
        id: crypto.randomUUID(),
        orderId,
        menuId: null,
        dishId: dish.id,
        nameSnapshot: dish.name,
        unitPriceCents: dish.priceCents,
        quantity
      };
    });

    const totalCents = items.reduce((sum, it) => sum + it.unitPriceCents * it.quantity, 0);

    await db.insert(ordersTable).values({
      id: orderId,
      restaurantId,
      clientId: useClient ? pick(clientRows).id : null,
      tableId: useTable ? pick(tables).id : null,
      status,
      totalCents,
      notes: null,
      placedAt,
      createdAt: placedAt,
      updatedAt: placedAt
    });

    await db.insert(orderItemsTable).values(items);
  }

  console.log(`  ✓ ${seed.name}: ${tableCount} tables, ${dishRows.length} dishes, ${seed.menus.length} menus, ${clientCount} clients, ${orderCount} orders`);
}

async function main(): Promise<void> {
  console.log("Seeding demo data...");

  await cleanup();

  const userId = await createDemoUser();

  const orgId = crypto.randomUUID();

  await db.insert(organizationsTable).values({
    id: orgId,
    name: `Groupe Ody Demo ${Date.now()}`,
    ownerId: userId
  });

  console.log(`Created organization: ${orgId}`);

  for (const seed of RESTAURANTS) {
    const restaurantId = crypto.randomUUID();

    await db.insert(restaurantsTable).values({
      id: restaurantId,
      organizationId: orgId,
      name: seed.name,
      address: seed.address,
      phone: seed.phone,
      maxCovers: seed.maxCovers,
      tableService: true,
      clickAndCollect: Math.random() > 0.5,
      kitchenNotifications: true,
      testMode: false
    });

    await seedRestaurant(restaurantId, seed);
  }

  console.log("\n✅ Demo seed complete!");
  console.log(`   Login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
