import { RestaurantInvalidSettingsError } from "@/errors/restaurant/restaurant-invalid-settings/restaurant-invalid-settings.error";

export interface RestaurantSettingsProps {
  address: string;
  phone: string;
  maxCovers: number;
  tableService: boolean;
  clickAndCollect: boolean;
  kitchenNotifications: boolean;
  testMode: boolean;
}

const MAX_PHONE_LENGTH = 32;
const MIN_ADDRESS_LENGTH = 3;

export class RestaurantSettings {
  private constructor(private readonly props: RestaurantSettingsProps) {}

  static create(props: RestaurantSettingsProps): RestaurantSettings {
    if (props.maxCovers <= 0) {
      throw new RestaurantInvalidSettingsError("maxCovers must be > 0");
    }

    if (!Number.isInteger(props.maxCovers)) {
      throw new RestaurantInvalidSettingsError("maxCovers must be an integer");
    }

    const address = props.address?.trim() ?? "";

    if (address.length < MIN_ADDRESS_LENGTH) {
      throw new RestaurantInvalidSettingsError("address is too short");
    }

    const phone = props.phone?.trim() ?? "";

    if (phone.length === 0 || phone.length > MAX_PHONE_LENGTH) {
      throw new RestaurantInvalidSettingsError("phone is invalid");
    }

    return new RestaurantSettings({ ...props, address, phone });
  }

  get address(): string { return this.props.address; }
  get phone(): string { return this.props.phone; }
  get maxCovers(): number { return this.props.maxCovers; }
  get tableService(): boolean { return this.props.tableService; }
  get clickAndCollect(): boolean { return this.props.clickAndCollect; }
  get kitchenNotifications(): boolean { return this.props.kitchenNotifications; }
  get testMode(): boolean { return this.props.testMode; }

  with(partial: Partial<RestaurantSettingsProps>): RestaurantSettings {
    return RestaurantSettings.create({ ...this.props, ...partial });
  }

  toJSON(): RestaurantSettingsProps {
    return { ...this.props };
  }
}
