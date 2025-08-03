import { Expose, Transform } from 'class-transformer';

export class GetInterviewLogListItemResponseDto {
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
}
