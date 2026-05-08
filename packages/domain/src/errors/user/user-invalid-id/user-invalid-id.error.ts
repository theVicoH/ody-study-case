export class UserInvalidIdError extends Error {
  constructor(id: string) {
    super(`Invalid user id: ${id}`);
    this.name = "UserInvalidIdError";
  }
}
