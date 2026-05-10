import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MaximizeIcon } from "./maximize.icon";

const TEST_ICON_SIZE = 48;

describe("MaximizeIcon", () => {
  it("renders without crashing", () => {
    render(<MaximizeIcon data-testid="maximize-icon" />);
    expect(screen.getByTestId("maximize-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<MaximizeIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<MaximizeIcon className="custom-class" data-testid="maximize-icon" />);
    expect(screen.getByTestId("maximize-icon").className).toContain("custom-class");
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<MaximizeIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="maximize-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("maximize-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<MaximizeIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
