export interface UpdateRestaurantSettingsDTO {
  id: string;
  address?: string;
  phone?: string;
  maxCovers?: number;
  tableService?: boolean;
  clickAndCollect?: boolean;
  kitchenNotifications?: boolean;
  testMode?: boolean;
}
