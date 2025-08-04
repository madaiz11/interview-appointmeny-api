import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/entities';
import { InterviewCommentsDI } from 'src/interview/di/interview-comments.di';
import { InterviewLogsDI } from 'src/interview/di/interview-logs.di';
import { InterviewDI } from 'src/interview/di/interview.di';
import { GetInterviewCommentListRequestDto } from 'src/interview/dto/get-interview-comment-list.request';
import { GetInterviewCommentListResponseDto } from 'src/interview/dto/get-interview-comment-list.response';
import { GetInterviewDetailResponseDto } from 'src/interview/dto/get-interview-detail.response';
import { GetInterviewListRequestDto } from 'src/interview/dto/get-interview-list.request.dto';
import { GetInterviewListResponseDto } from 'src/interview/dto/get-interview-list.response';
import { GetInterviewLogListRequestDto } from 'src/interview/dto/get-interview-log-list.request.dto';
import { GetInterviewLogListResponseDto } from 'src/interview/dto/get-interview-log-list.response';
import { UpdateInterviewDetailRequestDto } from 'src/interview/dto/update-interview-detail.request.dto';
import { InterviewUtil } from 'src/interview/interview.util';
import { InterviewCommentsMapper } from 'src/interview/mapper/interview-comments.mapper';
import { InterviewLogsMapper } from 'src/interview/mapper/interview-logs.mapper';
import { InterviewMapper } from 'src/interview/mapper/interview.mapper';
import { InterviewCommentsRepository } from 'src/interview/reporitories/interview-comments.repoitory';
import { InterviewLogsRepository } from 'src/interview/reporitories/interview-logs.repository';
import { InterviewRepository } from 'src/interview/reporitories/interview.repository';
import { InterviewCommentValidator } from 'src/interview/validators/interview-comment.validator';
import { InterviewValidator } from 'src/interview/validators/interview.validator';

@Injectable()
export class InterviewService {
  constructor(
    @Inject(InterviewDI.repository)
    private readonly interviewRepository: InterviewRepository,

    @Inject(InterviewLogsDI.repository)
    private readonly interviewLogsRepository: InterviewLogsRepository,

    @Inject(InterviewCommentsDI.repository)
    private readonly interviewCommentsRepository: InterviewCommentsRepository,
  ) {}

  async getInterviewList(
    request: GetInterviewListRequestDto,
  ): Promise<GetInterviewListResponseDto> {
    const { items, total } =
      await this.interviewRepository.getInterviewList(request);

    return InterviewMapper.toGetInterviewListResponseDto(
      items,
      total,
      request.page,
      request.limit,
    );
  }

  async getInterviewDetail(id: string): Promise<GetInterviewDetailResponseDto> {
    const result = await this.interviewRepository.getInterviewDetail(id);

    InterviewValidator.validateInterviewExists(result);

    InterviewValidator.validateInterviewNotArchived(result!);

    return InterviewMapper.toGetInterviewDetailResponseDto(result!);
  }

  async updateInterviewDetail(
    id: string,
    request: UpdateInterviewDetailRequestDto,
    loggedInUser: User,
  ): Promise<void> {
    const result = await this.interviewRepository.getInterviewDetail(id);

    InterviewValidator.validateInterviewExists(result);

    InterviewValidator.validateInterviewNotArchived(result!);

    InterviewValidator.validateInterviewAllowedToUpdate(result!, loggedInUser);

    const updatedInterview = InterviewUtil.getUpdatedInterview(
      result!,
      request,
    );

    await this.interviewRepository.repo.manager.transaction(async (manager) => {
      const { affected } = await this.interviewRepository.updateInterviewDetail(
        id,
        updatedInterview,
        manager,
      );

      if (affected && affected > 0) {
        await this.interviewLogsRepository.createInterviewLog(
          id,
          request,
          loggedInUser,
          manager,
        );
      }
    });
  }

  async archiveInterview(id: string): Promise<void> {
    const result = await this.interviewRepository.getInterviewDetail(id);

    InterviewValidator.validateInterviewExists(result);

    InterviewValidator.validateInterviewNotArchived(result!);

    await this.interviewRepository.archiveInterview(id);
  }

  async getInterviewLogList(
    interviewId: string,
    request: GetInterviewLogListRequestDto,
  ): Promise<GetInterviewLogListResponseDto> {
    const { items, total } =
      await this.interviewLogsRepository.getInterviewLogs(interviewId, request);

    return InterviewLogsMapper.toGetInterviewLogListResponseDto(
      items,
      total,
      request.page,
      request.limit,
    );
  }

  async getInterviewCommentList(
    interviewId: string,
    request: GetInterviewCommentListRequestDto,
    currentUser: User,
  ): Promise<GetInterviewCommentListResponseDto> {
    const { items, total } = await this.interviewCommentsRepository.getList(
      interviewId,
      currentUser.id,
      request,
    );

    return InterviewCommentsMapper.toGetInterviewCommentListResponseDto(
      items,
      total,
      request.page,
      request.limit,
    );
  }

  async createInterviewComment(
    interviewId: string,
    comment: string,
    currentUser: User,
  ): Promise<void> {
    const result =
      await this.interviewRepository.getInterviewDetail(interviewId);

    InterviewValidator.validateInterviewExists(result);

    InterviewValidator.validateInterviewNotArchived(result!);

    await this.interviewCommentsRepository.create(
      interviewId,
      comment,
      currentUser.id,
    );
  }

  async updateInterviewComment(
    commentId: string,
    comment: string,
    currentUser: User,
  ): Promise<void> {
    const result =
      await this.interviewCommentsRepository.getByCommentId(commentId);

    InterviewCommentValidator.validateInterviewCommentExists(result);

    InterviewCommentValidator.validateInterviewCommentAllowedToUpdate(
      result!,
      currentUser,
    );

    await this.interviewCommentsRepository.update(commentId, comment);
  }

  async deleteInterviewComment(
    commentId: string,
    currentUser: User,
  ): Promise<void> {
    const result =
      await this.interviewCommentsRepository.getByCommentId(commentId);

    InterviewCommentValidator.validateInterviewCommentExists(result);

    InterviewCommentValidator.validateInterviewCommentAllowedToUpdate(
      result!,
      currentUser,
    );

    await this.interviewCommentsRepository.repo.delete(commentId);
  }
}
