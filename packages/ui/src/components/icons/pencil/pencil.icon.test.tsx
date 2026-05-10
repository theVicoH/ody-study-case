import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PencilIcon } from "./pencil.icon";

const TEST_ICON_SIZE = 48;

describe("PencilIcon", () => {
  it("renders without crashing", () => {
    render(<PencilIcon data-testid="pencil-icon" />);
    expect(screen.getByTestId("pencil-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<PencilIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<PencilIcon className="custom-class" data-testid="pencil-icon" />);
    expect(screen.getByTestId("pencil-icon").className).toContain("custom-class");
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<PencilIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="pencil-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("pencil-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<PencilIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
