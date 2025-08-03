import { PaginationResponseDto } from 'src/shared/dto/pagination.response.dto';
import { GetInterviewLogListItemResponseDto } from './get-interview-log-list-item.response';

export class GetInterviewLogListResponseDto extends PaginationResponseDto<GetInterviewLogListItemResponseDto> {}
