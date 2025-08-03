import { Expose } from 'class-transformer';
import { GetInterviewListItemResponseDto } from './get-interview-list-item.response';

export class GetInterviewListResponseDto {
  @Expose()
  items: GetInterviewListItemResponseDto[];

  @Expose()
  isLastPage: boolean;

  @Expose()
  nextPage: number | undefined;

  @Expose()
  limit: number;
}
