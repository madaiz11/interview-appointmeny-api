export class UserSessionDI {
  public static readonly repository: unique symbol = Symbol(
    'UserSessionRepository',
  );
}
