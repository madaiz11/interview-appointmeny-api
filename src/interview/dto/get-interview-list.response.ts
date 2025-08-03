import { PaginationResponseDto } from 'src/shared/dto/pagination.response.dto';
import { GetInterviewListItemResponseDto } from './get-interview-list-item.response';

export class GetInterviewListResponseDto extends PaginationResponseDto<GetInterviewListItemResponseDto> {}
