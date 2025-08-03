import { Expose, Transform } from 'class-transformer';

export class GetInterviewDetailResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Transform(({ obj }) => obj.interviewStatus.code)
  statusCode: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Transform(({ obj }) => obj.createdByUser.name)
  creatorName: string;

  @Expose()
  @Transform(({ obj }) => obj.createdByUser.email)
  creatorEmail: string;

  @Expose()
  @Transform(({ obj }) => obj.createdByUser.avatarUrl)
  creatorAvatarUrl: string;
}
