import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArrowLeftIcon } from "./arrow-left.icon";

const CUSTOM_SIZE = 32;

describe("ArrowLeftIcon", () => {
  it("renders without crashing", () => {
    const { container } = render(<ArrowLeftIcon />);

    expect(container.firstChild).toBeTruthy();
  });

  it("applies custom size", () => {
    const { container } = render(<ArrowLeftIcon size={CUSTOM_SIZE} />);

    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });
});
