export class UserInvalidEmailError extends Error {
  constructor(email: string) {
    super(`Invalid email: ${email}`);
    this.name = "UserInvalidEmailError";
  }
}
