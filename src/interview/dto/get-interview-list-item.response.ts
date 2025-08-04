import { Expose, Transform } from 'class-transformer';
import { Interview } from 'src/entities';

export class GetInterviewListItemResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Transform(({ obj }: { obj: Interview }) => obj?.interviewStatus?.title || '')
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Transform(({ obj }: { obj: Interview }) => obj?.createdByUser?.name || '')
  creatorName: string;

  @Expose()
  @Transform(
    ({ obj }: { obj: Interview }) => obj?.createdByUser?.avatarUrl || '',
  )
  creatorAvatarUrl: string;
}
