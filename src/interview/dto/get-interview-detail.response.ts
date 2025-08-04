import { Expose, Transform } from 'class-transformer';
import { Interview } from 'src/entities';

export class GetInterviewDetailResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Transform(({ obj }: { obj: Interview }) => obj?.interviewStatus?.code || '')
  statusCode: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Transform(({ obj }: { obj: Interview }) => obj?.createdByUser?.name || '')
  creatorName: string;

  @Expose()
  @Transform(({ obj }: { obj: Interview }) => obj?.createdByUser?.email || '')
  creatorEmail: string;

  @Expose()
  @Transform(
    ({ obj }: { obj: Interview }) => obj?.createdByUser?.avatarUrl || '',
  )
  creatorAvatarUrl: string;
}
