import React from "react";

import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { GridOverlay } from "@workspace/ui/components/layouts/grid-overlay/grid-overlay.layout";
import { Toaster } from "@workspace/ui/components/ui/sonner";
import appCss from "@workspace/ui/globals.css?url";

import type { QueryClient } from "@tanstack/react-query";

import { useGridOverlay } from "@/hooks/use-grid-overlay/use-grid-overlay.hook";


interface RouterContext {
  queryClient: QueryClient;
}

const RootComponent = (): React.JSX.Element => {
  const { visible } = useGridOverlay();

  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <GridOverlay visible={visible} leftOffset={264} />
        <Toaster position="top-center" />
        <Scripts />
      </body>
    </html>
  );
};

const NotFound = (): React.JSX.Element => (
  <div className="flex min-h-svh items-center justify-center">
    <p className="text-muted-foreground typo-body-sm">404 — Page not found</p>
  </div>
);

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ody" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/images/logo.png" }
    ]
  }),
  notFoundComponent: NotFound,
  component: RootComponent
});
