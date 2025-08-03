import { Expose, Transform } from 'class-transformer';

export class GetInterviewListItemResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Transform(({ obj }) => obj.interviewStatus.title)
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.createdByUser.name)
  creatorName: string;

  @Expose()
  @Transform(({ obj }) => obj.createdByUser.avatarUrl)
  creatorAvatarUrl: string;
}
