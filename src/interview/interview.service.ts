import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/entities';
import { InterviewLogsDI } from 'src/interview/di/interview-logs.di';
import { InterviewDI } from 'src/interview/di/interview.di';
import { GetInterviewDetailResponseDto } from 'src/interview/dto/get-interview-detail.response';
import { GetInterviewListRequestDto } from 'src/interview/dto/get-interview-list.requet.dto';
import { GetInterviewListResponseDto } from 'src/interview/dto/get-interview-list.response';
import { UpdateInterviewDetailRequestDto } from 'src/interview/dto/update-interview-detail.request.dto';
import { InterviewUtil } from 'src/interview/interview.util';
import { InterviewValidator } from 'src/interview/interview.validator';
import { InterviewMapper } from 'src/interview/mapper/interview.mapper';
import { InterviewLogsRepository } from 'src/interview/reporitories/interview-logs.repository';
import { InterviewRepository } from 'src/interview/reporitories/interview.repository';

@Injectable()
export class InterviewService {
  constructor(
    @Inject(InterviewDI.repository)
    private readonly interviewRepository: InterviewRepository,

    @Inject(InterviewLogsDI.repository)
    private readonly interviewLogsRepository: InterviewLogsRepository,
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
}
