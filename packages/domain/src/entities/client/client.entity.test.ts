import { describe, expect, test } from "vitest";

import { Client } from "@/entities/client/client.entity";
import { ClientInvalidDataError } from "@/errors/client/client-invalid-data/client-invalid-data.error";
import { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";

const restaurantId = RestaurantId.generate();
const validProps = {
  firstName: "Jean",
  lastName: "Dupont",
  email: "a@b.cd",
  phone: "+33 6 00 00 00 00",
  notes: null,
  tag: "New" as const
};

describe("Client", () => {
  test("creates valid", () => {
    const c = Client.create(restaurantId, validProps);

    expect(c.props.firstName).toBe("Jean");
    expect(c.props.email).toBe("a@b.cd");
  });

  test("rejects empty firstName", () => {
    expect(() => Client.create(restaurantId, { ...validProps, firstName: "" })).toThrow(ClientInvalidDataError);
  });

  test("rejects invalid email", () => {
    expect(() => Client.create(restaurantId, { ...validProps, email: "not-an-email" })).toThrow(
      ClientInvalidDataError
    );
  });

  test("normalizes empty optional to null", () => {
    const c = Client.create(restaurantId, { ...validProps, email: "  ", phone: "" });

    expect(c.props.email).toBeNull();
    expect(c.props.phone).toBeNull();
  });

  test("update returns new instance with bumped updatedAt", async () => {
    const c = Client.create(restaurantId, validProps);

    await new Promise((res) => setTimeout(res, 1));
    const u = c.update({ ...validProps, firstName: "Marie" });

    expect(u.props.firstName).toBe("Marie");
    expect(u.id).toBe(c.id);
    expect(u.updatedAt.getTime()).toBeGreaterThanOrEqual(c.updatedAt.getTime());
  });
});
