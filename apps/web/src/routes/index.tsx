import React from "react";

import { createFileRoute } from "@tanstack/react-router";

const App = (): React.JSX.Element => {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md flex-col gap-4 text-sm leading-loose">
        <h1 className="font-medium">Project ready!</h1>
        <p className="text-muted-foreground">You may now add components and start building.</p>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: App
});
