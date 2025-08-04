import { Expose, Transform } from 'class-transformer';
import { InterviewComments } from 'src/entities';

export class GetInterviewCommentItemResponseDto {
  @Expose()
  id: string;

  @Expose()
  comment: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  isViewOnly: boolean;

  @Expose()
  @Transform(
    ({ obj }: { obj: InterviewComments }) => obj?.createdByUser?.name || '',
  )
  creatorName: string;

  @Transform(
    ({ obj }: { obj: InterviewComments }) =>
      obj?.createdByUser?.avatarUrl || '',
  )
  creatorAvatarUrl: string;
}
