import { UserInvalidEmailError } from "@/errors/user/user-invalid-email/user-invalid-email.error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserEmail {
  private constructor(private readonly value : string){}

  static create(value: string): UserEmail {
    const normalised = value.toLowerCase().trim();

    if(!EMAIL_REGEX.test(normalised)) {
      throw new UserInvalidEmailError(value);
    }

    return new UserEmail(normalised);
  }

  toString(): string{
    return this.value;
  }

}
