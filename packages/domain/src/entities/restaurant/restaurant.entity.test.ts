import { describe, expect, test } from "vitest";

import { Restaurant } from "@/entities/restaurant/restaurant.entity";
import { OrganizationId } from "@/value-objects/organization/organization-id/organization-id.value-object";
import { RestaurantName } from "@/value-objects/restaurant/restaurant-name/restaurant-name.value-object";
import { RestaurantSettings } from "@/value-objects/restaurant/restaurant-settings/restaurant-settings.value-object";

const orgId = OrganizationId.generate();
const name = RestaurantName.create("Le Gourmet");
const settings = RestaurantSettings.create({
  address: "1 rue de la Paix",
  phone: "+33 1 23 45 67 89",
  maxCovers: 80,
  tableService: true,
  clickAndCollect: true,
  kitchenNotifications: true,
  testMode: false
});

describe("Restaurant", () => {
  test("should create", () => {
    const r = Restaurant.create(orgId, name, settings);

    expect(r.id.toString()).toBeDefined();
    expect(r.organizationId.toString()).toBe(orgId.toString());
    expect(r.name.toString()).toBe("Le Gourmet");
    expect(r.settings.address).toBe(settings.address);
    expect(r.createdAt.getTime()).toBe(r.updatedAt.getTime());
  });

  test("should rename", async () => {
    const r = Restaurant.create(orgId, name, settings);

    await new Promise((res) => setTimeout(res, 1));
    const renamed = r.rename(RestaurantName.create("Bistrot 21"));

    expect(renamed.name.toString()).toBe("Bistrot 21");
    expect(renamed.id).toBe(r.id);
    expect(renamed.createdAt).toBe(r.createdAt);
    expect(renamed.updatedAt.getTime()).toBeGreaterThanOrEqual(r.updatedAt.getTime());
  });

  test("should update settings", async () => {
    const r = Restaurant.create(orgId, name, settings);

    await new Promise((res) => setTimeout(res, 1));
    const newSettings = settings.with({ tableService: false });
    const updated = r.updateSettings(newSettings);

    expect(updated.settings.tableService).toBe(false);
    expect(updated.id).toBe(r.id);
    expect(updated.name).toBe(r.name);
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(r.updatedAt.getTime());
  });
});
