import { LoginDto } from '../../auth/dto/login.dto';
import { GetInterviewListRequestDto } from '../../interview/dto/get-interview-list.request.dto';
import { GetInterviewCommentListRequestDto } from '../../interview/dto/get-interview-comment-list.request';
import { GetInterviewLogListRequestDto } from '../../interview/dto/get-interview-log-list.request.dto';
import { MutationInterviewCommentRequestDto } from '../../interview/dto/mutation-interview-comment.request.dto';
import { UpdateInterviewDetailRequestDto } from '../../interview/dto/update-interview-detail.request.dto';
import { MasterInterviewStatusCode } from '../../shared/enum/master/interview-status-code.enum';

export const mockLoginDto: LoginDto = {
  email: 'test@example.com',
  password: 'password123',
};

export const mockGetInterviewListRequestDto: GetInterviewListRequestDto = {
  page: 1,
  limit: 10,
};

export const mockGetInterviewCommentListRequestDto: GetInterviewCommentListRequestDto = {
  page: 1,
  limit: 10,
};

export const mockGetInterviewLogListRequestDto: GetInterviewLogListRequestDto = {
  page: 1,
  limit: 10,
};

export const mockMutationInterviewCommentRequestDto: MutationInterviewCommentRequestDto = {
  comment: 'This is a test comment',
};

export const mockUpdateInterviewDetailRequestDto: UpdateInterviewDetailRequestDto = {
  title: 'Updated Interview Title',
  description: 'Updated description',
  statusCode: MasterInterviewStatusCode.IN_PROGRESS,
};

export const mockGetInterviewListItemResponseDto = {
  id: 'test-interview-id',
  title: 'Test Interview',
  description: 'Test Description',
  status: 'Todo',
  createdAt: new Date('2024-01-01'),
  creatorName: 'Test User',
  creatorAvatarUrl: 'https://example.com/avatar.jpg',
};