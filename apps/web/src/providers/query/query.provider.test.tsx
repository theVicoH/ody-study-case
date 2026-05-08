import React from "react";

import { useQueryClient } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { QueryProvider } from "./query.provider";

const ConsumerComponent = (): React.JSX.Element => {
  const client = useQueryClient();

  return <div data-testid="client">{client ? "has-client" : "no-client"}</div>;
};

describe("QueryProvider", () => {
  it("provides a QueryClient to children", () => {
    render(<QueryProvider>
      <ConsumerComponent />
    </QueryProvider>);

    expect(screen.getByTestId("client")).toHaveTextContent("has-client");
  });
});
