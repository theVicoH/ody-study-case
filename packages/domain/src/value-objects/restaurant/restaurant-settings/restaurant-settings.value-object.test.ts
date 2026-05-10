import { describe, expect, test } from "vitest";

import { RestaurantInvalidSettingsError } from "@/errors/restaurant/restaurant-invalid-settings/restaurant-invalid-settings.error";
import { RestaurantSettings } from "@/value-objects/restaurant/restaurant-settings/restaurant-settings.value-object";

const NEGATIVE_COVERS_MAGNITUDE = 3;
const NEGATIVE_COVERS = -NEGATIVE_COVERS_MAGNITUDE;

const valid = {
  address: "1 rue de la Paix",
  phone: "+33 1 23 45 67 89",
  maxCovers: 80,
  tableService: true,
  clickAndCollect: true,
  kitchenNotifications: true,
  testMode: false
};

describe("RestaurantSettings", () => {
  test("should create with valid props", () => {
    const s = RestaurantSettings.create(valid);

    expect(s.address).toBe(valid.address);
    expect(s.phone).toBe(valid.phone);
    expect(s.maxCovers).toBe(80);
    expect(s.tableService).toBe(true);
    expect(s.clickAndCollect).toBe(true);
    expect(s.kitchenNotifications).toBe(true);
    expect(s.testMode).toBe(false);
  });

  test("should throw if maxCovers is 0", () => {
    expect(() => RestaurantSettings.create({ ...valid, maxCovers: 0 })).toThrow(RestaurantInvalidSettingsError);
  });

  test("should throw if maxCovers is negative", () => {
    expect(() => RestaurantSettings.create({ ...valid, maxCovers: NEGATIVE_COVERS })).toThrow(RestaurantInvalidSettingsError);
  });

  test("should throw if maxCovers is not integer", () => {
    expect(() => RestaurantSettings.create({ ...valid, maxCovers: 1.5 })).toThrow(RestaurantInvalidSettingsError);
  });

  test("should throw if address is too short", () => {
    expect(() => RestaurantSettings.create({ ...valid, address: "x" })).toThrow(RestaurantInvalidSettingsError);
  });

  test("should throw if phone is empty", () => {
    expect(() => RestaurantSettings.create({ ...valid, phone: "" })).toThrow(RestaurantInvalidSettingsError);
  });

  test("should immutably patch with `with`", () => {
    const s = RestaurantSettings.create(valid);
    const next = s.with({ tableService: false });

    expect(s.tableService).toBe(true);
    expect(next.tableService).toBe(false);
    expect(next.maxCovers).toBe(s.maxCovers);
  });

  test("toJSON returns plain props", () => {
    const s = RestaurantSettings.create(valid);

    expect(s.toJSON()).toEqual(valid);
  });
});
