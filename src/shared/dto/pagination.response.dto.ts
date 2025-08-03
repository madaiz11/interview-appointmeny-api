import { Expose } from 'class-transformer';

export class PaginationResponseDto<T> {
  @Expose()
  items: T[];

  @Expose()
  isLastPage: boolean;

  @Expose()
  nextPage: number | undefined;

  @Expose()
  limit: number;
}
