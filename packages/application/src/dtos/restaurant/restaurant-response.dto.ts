export interface RestaurantResponseDTO {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  phone: string;
  maxCovers: number;
  tableService: boolean;
  clickAndCollect: boolean;
  kitchenNotifications: boolean;
  testMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}
