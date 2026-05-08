import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

import { AppProviders } from "@/providers/app/app.provider";
import { queryClient } from "@/providers/query/query.client";

const routerOptions = {
  routeTree,
  context: { queryClient },
  scrollRestoration: true as const,
  defaultPreload: "intent" as const,
  defaultPreloadStaleTime: 0,
  Wrap: AppProviders
};

export const _dummyRouter = createTanStackRouter(routerOptions);

export type AppRouter = typeof _dummyRouter;

export function getRouter(): AppRouter {
  return createTanStackRouter(routerOptions) as unknown as AppRouter;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter;
  }
}
