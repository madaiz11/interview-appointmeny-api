import { Expose, Transform } from 'class-transformer';
import { InterviewLogs } from 'src/entities';

export class GetInterviewLogListItemResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Transform(
    ({ obj }: { obj: InterviewLogs }) => obj?.interviewStatus?.title || '',
  )
  status: string;

  @Expose()
  createdAt: Date;
}
