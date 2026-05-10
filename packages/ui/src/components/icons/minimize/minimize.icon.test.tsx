import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MinimizeIcon } from "./minimize.icon";

const TEST_ICON_SIZE = 48;

describe("MinimizeIcon", () => {
  it("renders without crashing", () => {
    render(<MinimizeIcon data-testid="minimize-icon" />);
    expect(screen.getByTestId("minimize-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<MinimizeIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<MinimizeIcon className="custom-class" data-testid="minimize-icon" />);
    expect(screen.getByTestId("minimize-icon").className).toContain("custom-class");
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<MinimizeIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="minimize-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("minimize-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<MinimizeIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
