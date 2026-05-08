export interface UpdateUserDTO {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  birthday?: Date;
  image?: string | null;
}
