export class InterviewLogsDI {
  public static readonly repository: unique symbol = Symbol(
    'InterviewLogsRepository',
  );
}
