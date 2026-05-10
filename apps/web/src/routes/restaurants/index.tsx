import { createFileRoute } from "@tanstack/react-router";

const Empty = (): null => null;

export const Route = createFileRoute("/restaurants/")({
  component: Empty
});
