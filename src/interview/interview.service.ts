import { Inject, Injectable } from '@nestjs/common';
import { InterviewDI } from 'src/interview/di/interview.di';
import { GetInterviewDetailResponseDto } from 'src/interview/dto/get-interview-detail.response';
import { GetInterviewListRequestDto } from 'src/interview/dto/get-interview-list.requet.dto';
import { GetInterviewListResponseDto } from 'src/interview/dto/get-interview-list.response';
import { InterviewValidator } from 'src/interview/interview.validator';
import { InterviewMapper } from 'src/interview/mapper/interview.mapper';
import { InterviewRepository } from 'src/interview/reporitories/interview.repository';

@Injectable()
export class InterviewService {
  constructor(
    @Inject(InterviewDI.repository)
    private readonly interviewRepository: InterviewRepository,
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
}
