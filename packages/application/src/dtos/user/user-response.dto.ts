export interface UserResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  updatedAt: Date;
  createdAt: Date;
  emailVerified: boolean;                                                                                               
  image: string | null;
}
