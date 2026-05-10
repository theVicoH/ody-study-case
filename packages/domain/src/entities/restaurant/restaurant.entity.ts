import type { OrganizationId } from "@/value-objects/organization/organization-id/organization-id.value-object";
import type { RestaurantName } from "@/value-objects/restaurant/restaurant-name/restaurant-name.value-object";
import type { RestaurantSettings } from "@/value-objects/restaurant/restaurant-settings/restaurant-settings.value-object";

import { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";

export class Restaurant {
  private constructor(
    public readonly id: RestaurantId,
    public readonly organizationId: OrganizationId,
    public readonly name: RestaurantName,
    public readonly settings: RestaurantSettings,
    public readonly updatedAt: Date,
    public readonly createdAt: Date
  ) {}

  static create(
    organizationId: OrganizationId,
    name: RestaurantName,
    settings: RestaurantSettings
  ): Restaurant {
    const now = new Date();

    return new Restaurant(RestaurantId.generate(), organizationId, name, settings, now, now);
  }

  static reconstitute(
    id: RestaurantId,
    organizationId: OrganizationId,
    name: RestaurantName,
    settings: RestaurantSettings,
    updatedAt: Date,
    createdAt: Date
  ): Restaurant {
    return new Restaurant(id, organizationId, name, settings, updatedAt, createdAt);
  }

  rename(name: RestaurantName): Restaurant {
    return new Restaurant(this.id, this.organizationId, name, this.settings, new Date(), this.createdAt);
  }

  updateSettings(settings: RestaurantSettings): Restaurant {
    return new Restaurant(this.id, this.organizationId, this.name, settings, new Date(), this.createdAt);
  }
}
