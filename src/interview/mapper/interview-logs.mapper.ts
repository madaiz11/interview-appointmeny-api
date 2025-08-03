import { plainToInstance } from 'class-transformer';
import { InterviewLogs } from 'src/entities';
import { GetInterviewLogListItemResponseDto } from 'src/interview/dto/get-interview-log-list-item.response';
import { GetInterviewLogListResponseDto } from 'src/interview/dto/get-interview-log-list.response';

export class InterviewLogsMapper {
  static toGetInterviewLogListResponseDto(
    interviewLogs: InterviewLogs[],
    total: number,
    page: number,
    limit: number,
  ): GetInterviewLogListResponseDto {
    const items = interviewLogs.map((interviewLog) =>
      plainToInstance(GetInterviewLogListItemResponseDto, interviewLog, {
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
