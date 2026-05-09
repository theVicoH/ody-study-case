import React from "react";

import { createFileRoute } from "@tanstack/react-router";

const App = (): React.JSX.Element => {
  return (
    <div className="p-lg flex min-h-svh items-center justify-center">
      <div className="gap-md typo-body-sm flex max-w-md flex-col">
        <h1 className="typo-button">Project ready!</h1>
        <p className="text-muted-foreground">You may now add components and start building.</p>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: App
});
