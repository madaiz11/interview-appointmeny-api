import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { InterviewLogs, User } from 'src/entities';
import { GetInterviewLogListRequestDto } from 'src/interview/dto/get-interview-log-list.request.dto';
import { UpdateInterviewDetailRequestDto } from 'src/interview/dto/update-interview-detail.request.dto';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class InterviewLogsRepository {
  constructor(
    @InjectRepository(InterviewLogs)
    private readonly interviewLogsRepository: Repository<InterviewLogs>,
  ) {}

  async createInterviewLog(
    interviewId: string,
    detail: UpdateInterviewDetailRequestDto,
    user: User,
    manager?: EntityManager,
  ): Promise<InterviewLogs> {
    const repo =
      manager?.getRepository(InterviewLogs) ?? this.interviewLogsRepository;

    const logs = plainToInstance(InterviewLogs, {
      interviewId,
      createdByUserId: user.id,
      title: detail.title,
      description: detail.description,
      interviewStatusCode: detail.statusCode,
    });

    return repo.save(logs);
  }

  async getInterviewLogs(
    interviewId: string,
    { page, limit }: GetInterviewLogListRequestDto,
  ) {
    const [items, total] = await this.interviewLogsRepository.findAndCount({
      where: { interviewId },
      relations: ['interviewStatus', 'createdByUser'],
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        interviewStatus: {
          code: true,
          title: true,
        },
        createdByUser: {
          name: true,
          avatarUrl: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
    };
  }
}
