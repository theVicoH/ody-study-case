import { ClientInvalidDataError } from "@/errors/client/client-invalid-data/client-invalid-data.error";

import { ClientId } from "@/value-objects/client/client-id/client-id.value-object";
import { RestaurantId } from "@/value-objects/restaurant/restaurant-id/restaurant-id.value-object";

export type ClientTag = "New" | "Regular" | "VIP";

const VALID_TAGS: ReadonlyArray<ClientTag> = ["New", "Regular", "VIP"];

export interface ClientProps {
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  tag: ClientTag;
}

const NAME_MIN = 1;
const NAME_MAX = 80;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (props: ClientProps): ClientProps => {
  const firstName = props.firstName.trim();
  const lastName = props.lastName.trim();

  if (firstName.length < NAME_MIN || firstName.length > NAME_MAX) {
    throw new ClientInvalidDataError("firstName", props.firstName);
  }

  if (lastName.length < NAME_MIN || lastName.length > NAME_MAX) {
    throw new ClientInvalidDataError("lastName", props.lastName);
  }

  const email = props.email?.trim() || null;

  if (email !== null && !EMAIL_REGEX.test(email)) {
    throw new ClientInvalidDataError("email", props.email);
  }

  const phone = props.phone?.trim() || null;
  const notes = props.notes?.trim() || null;

  if (!VALID_TAGS.includes(props.tag)) {
    throw new ClientInvalidDataError("tag", props.tag);
  }

  return { firstName, lastName, email, phone, notes, tag: props.tag };
};

export class Client {
  private constructor(
    public readonly id: ClientId,
    public readonly restaurantId: RestaurantId,
    public readonly props: ClientProps,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(restaurantId: RestaurantId, props: ClientProps): Client {
    const now = new Date();

    return new Client(ClientId.generate(), restaurantId, validate(props), now, now);
  }

  static reconstitute(
    id: ClientId,
    restaurantId: RestaurantId,
    props: ClientProps,
    createdAt: Date,
    updatedAt: Date
  ): Client {
    return new Client(id, restaurantId, props, createdAt, updatedAt);
  }

  update(props: ClientProps): Client {
    return new Client(this.id, this.restaurantId, validate(props), this.createdAt, new Date());
  }

  withTag(tag: ClientTag): Client {
    if (this.props.tag === tag) return this;

    return new Client(
      this.id,
      this.restaurantId,
      { ...this.props, tag },
      this.createdAt,
      new Date()
    );
  }
}

export { VALID_TAGS };
