import { Expose, Transform } from 'class-transformer';

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
  @Transform(({ obj }) => obj.createdByUser.name)
  creatorName: string;

  @Expose()
  @Transform(({ obj }) => obj.createdByUser.avatarUrl)
  creatorAvatarUrl: string;
}
