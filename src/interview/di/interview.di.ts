export class InterviewDI {
  public static readonly repository: unique symbol = Symbol(
    'InterviewRepository',
  );

  public static readonly service: unique symbol = Symbol('InterviewService');
}
