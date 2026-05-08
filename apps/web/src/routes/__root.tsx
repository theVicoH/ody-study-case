import React from "react";

import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import appCss from "@workspace/ui/globals.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface RouterContext {
  queryClient: QueryClient;
}

const RootComponent = (): React.JSX.Element => {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
};

const NotFound = (): React.JSX.Element => (
  <div className="flex min-h-svh items-center justify-center">
    <p className="text-muted-foreground text-sm">404 — Page not found</p>
  </div>
);

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ody" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  notFoundComponent: NotFound,
  component: RootComponent
});


