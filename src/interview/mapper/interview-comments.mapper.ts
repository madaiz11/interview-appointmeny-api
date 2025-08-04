import { plainToInstance } from 'class-transformer';
import { InterviewComments } from 'src/entities';
import { GetInterviewCommentItemResponseDto } from 'src/interview/dto/get-interview-comment-item.response';
import { GetInterviewCommentListResponseDto } from 'src/interview/dto/get-interview-comment-list.response';

export class InterviewCommentsMapper {
  static toGetInterviewCommentListResponseDto(
    interviewComments: Array<
      InterviewComments & {
        isViewOnly: boolean;
      }
    >,
    total: number,
    page: number,
    limit: number,
  ): GetInterviewCommentListResponseDto {
    const items = interviewComments.map((interviewComment) =>
      plainToInstance(GetInterviewCommentItemResponseDto, interviewComment, {
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
