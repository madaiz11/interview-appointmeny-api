import { plainToInstance } from 'class-transformer';
import { Interview } from 'src/entities/interview.entity';
import { GetInterviewListItemResponseDto } from 'src/interview/dto/get-interview-list-item.response';
import { GetInterviewListResponseDto } from 'src/interview/dto/get-interview-list.response';

export class InterviewMapper {
  static toGetInterviewListResponseDto(
    interviews: Interview[],
    total: number,
    page: number,
    limit: number,
  ): GetInterviewListResponseDto {
    const items = interviews.map((interview) =>
      plainToInstance(GetInterviewListItemResponseDto, interview, {
        excludeExtraneousValues: true,
      }),
    );

    const isLastPage = total <= page * limit;

    return {
      items,
      isLastPage,
      nextPage: isLastPage ? undefined : page + 1,
      limit,
    };
  }
}
