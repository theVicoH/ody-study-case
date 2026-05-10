import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TrashIcon } from "./trash.icon";

const TEST_ICON_SIZE = 48;

describe("TrashIcon", () => {
  it("renders without crashing", () => {
    render(<TrashIcon data-testid="trash-icon" />);
    expect(screen.getByTestId("trash-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<TrashIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<TrashIcon className="custom-class" data-testid="trash-icon" />);
    expect(screen.getByTestId("trash-icon").className).toContain("custom-class");
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<TrashIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="trash-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("trash-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<TrashIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
