import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SettingsIcon } from "./settings.icon";

const TEST_ICON_SIZE = 48;

describe("SettingsIcon", () => {
  it("renders without crashing", () => {
    render(<SettingsIcon data-testid="settings-icon" />);
    expect(screen.getByTestId("settings-icon")).toBeDefined();
  });

  it("renders with custom size", () => {
    const { container } = render(<SettingsIcon size={TEST_ICON_SIZE} />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("width")).toBe(String(TEST_ICON_SIZE));
    expect(svg?.getAttribute("height")).toBe(String(TEST_ICON_SIZE));
  });

  it("applies custom className", () => {
    render(<SettingsIcon className="custom-class" data-testid="settings-icon" />);
    expect(screen.getByTestId("settings-icon").className).toContain("custom-class");
  });

  it("calls onMouseEnter when hovered in uncontrolled mode", () => {
    const onMouseEnter = vi.fn();

    render(<SettingsIcon onMouseEnter={onMouseEnter} data-testid="settings-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("settings-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("calls onMouseLeave when mouse leaves in uncontrolled mode", () => {
    const onMouseLeave = vi.fn();

    render(<SettingsIcon onMouseLeave={onMouseLeave} data-testid="settings-icon" />);
    fireEvent.mouseLeave(screen.getByTestId("settings-icon"));
    expect(onMouseLeave).not.toHaveBeenCalled();
  });

  it("does not animate when isAnimated is false", () => {
    const onMouseEnter = vi.fn();

    render(<SettingsIcon isAnimated={false} onMouseEnter={onMouseEnter} data-testid="settings-icon" />);
    fireEvent.mouseEnter(screen.getByTestId("settings-icon"));
    expect(onMouseEnter).not.toHaveBeenCalled();
  });

  it("renders svg with correct viewBox", () => {
    const { container } = render(<SettingsIcon />);
    const svg = container.querySelector("svg");

    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });
});
