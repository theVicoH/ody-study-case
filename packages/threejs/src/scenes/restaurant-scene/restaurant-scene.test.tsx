import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./restaurant-scene.controller", () => ({
  initRestaurantScene: vi.fn(() => ({
    selectRestaurant: vi.fn(),
    focusRestaurant: vi.fn(),
    setSunVisible: vi.fn(),
    resetCamera: vi.fn(),
    dispose: vi.fn()
  }))
}));

import { RestaurantScene } from "./restaurant-scene";

import type { Restaurant, RestaurantStats } from "@workspace/client";

const fixture: Restaurant = {
  id: "r1",
  name: "Test",
  type: "Atelier",
  address: "1 rue de Test",
  performance: "good",
  shape: "box",
  position: { x: 0, z: 0 },
  dimensions: { width: 1, depth: 1, height: 1 },
  colors: { primary: 0x8442ff, accent: 0xff3eb5 },
  model: "/models/corner-shop.gltf"
};

const stats: RestaurantStats = {
  covers: 1,
  revenue: 1,
  orders: 1,
  rating: "4.0",
  trend: "+1%"
};

describe("RestaurantScene", () => {
  it("renders a container element", () => {
    const { container } = render(
      <RestaurantScene
        restaurants={[fixture]}
        computeStats={() => stats}
        sunLabels={{ brand: "ODY", cta: "Click to explore" }}
        className="test-scene"
      />
    );

    const root = container.querySelector(".test-scene");

    expect(root).not.toBeNull();
  });
});
