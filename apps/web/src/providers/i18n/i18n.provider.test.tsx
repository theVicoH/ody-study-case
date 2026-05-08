import React from "react";

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { I18nProvider } from "./i18n.provider";

const ConsumerComponent = (): React.JSX.Element => {
  return <div data-testid="content">rendered</div>;
};

describe("I18nProvider", () => {
  it("renders children", () => {
    render(<I18nProvider>
      <ConsumerComponent />
    </I18nProvider>);

    expect(screen.getByTestId("content")).toHaveTextContent("rendered");
  });
});
