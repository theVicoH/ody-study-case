import React from "react";

import { useQueryClient } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppProviders } from "./app.provider";

const QueryConsumer = (): React.JSX.Element => {
  const client = useQueryClient();

  return <div data-testid="query">{client ? "has-client" : "no-client"}</div>;
};

describe("AppProviders", () => {
  it("provides QueryClient to children", () => {
    render(<AppProviders>
      <QueryConsumer />
    </AppProviders>);

    expect(screen.getByTestId("query")).toHaveTextContent("has-client");
  });
});
