const restaurantBase = (restaurantId: string): string => `/restaurants/${restaurantId}`;

export const apiRoutes = {
  auth: {
    session: "/api/auth/get-session"
  },
  organizations: {
    base: "/organizations",
    byId: (id: string): string => `/organizations/${id}`
  },
  restaurants: {
    base: "/restaurants",
    byId: (id: string): string => `/restaurants/${id}`,
    openingHours: (restaurantId: string): string => `${restaurantBase(restaurantId)}/opening-hours`,
    tables: {
      base: (restaurantId: string): string => `${restaurantBase(restaurantId)}/tables`,
      byId: (restaurantId: string, id: string): string => `${restaurantBase(restaurantId)}/tables/${id}`,
      bulkGenerate: (restaurantId: string): string => `${restaurantBase(restaurantId)}/tables/bulk-generate`
    },
    clients: {
      base: (restaurantId: string): string => `${restaurantBase(restaurantId)}/clients`,
      byId: (restaurantId: string, id: string): string => `${restaurantBase(restaurantId)}/clients/${id}`
    },
    dishes: {
      base: (restaurantId: string): string => `${restaurantBase(restaurantId)}/dishes`,
      byId: (restaurantId: string, id: string): string => `${restaurantBase(restaurantId)}/dishes/${id}`
    },
    menus: {
      base: (restaurantId: string): string => `${restaurantBase(restaurantId)}/menus`,
      byId: (restaurantId: string, id: string): string => `${restaurantBase(restaurantId)}/menus/${id}`
    },
    orders: {
      base: (restaurantId: string): string => `${restaurantBase(restaurantId)}/orders`,
      byId: (restaurantId: string, id: string): string => `${restaurantBase(restaurantId)}/orders/${id}`,
      status: (restaurantId: string, id: string): string => `${restaurantBase(restaurantId)}/orders/${id}/status`
    },
    stats: (restaurantId: string): string => `${restaurantBase(restaurantId)}/stats`
  },
  stats: {
    group: (restaurantIds: ReadonlyArray<string>): string => `/stats/group?restaurantIds=${restaurantIds.join(",")}`
  }
} as const;
