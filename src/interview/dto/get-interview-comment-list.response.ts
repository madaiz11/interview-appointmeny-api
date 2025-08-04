import { GetInterviewCommentItemResponseDto } from 'src/interview/dto/get-interview-comment-item.response';
import { PaginationResponseDto } from 'src/shared/dto/pagination.response.dto';

export class GetInterviewCommentListResponseDto extends PaginationResponseDto<GetInterviewCommentItemResponseDto> {}
