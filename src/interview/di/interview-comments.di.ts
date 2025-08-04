export class InterviewCommentsDI {
  public static readonly repository: unique symbol = Symbol(
    'InterviewCommentsRepository',
  );
}
