import { InjectRepository } from '@nestjs/typeorm';
import { Interview } from 'src/entities/interview.entity';
import { GetInterviewListRequestDto } from 'src/interview/dto/get-interview-list.request.dto';
import { ArchiveStatus } from 'src/shared/enum/archive-status.enum';
import { EntityManager, Repository, UpdateResult } from 'typeorm';

export class InterviewRepository {
  repo: Repository<Interview>;

  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
  ) {
    this.repo = interviewRepository;
  }

  async getInterviewList({ page, limit }: GetInterviewListRequestDto) {
    const [interviews, total] = await this.interviewRepository.findAndCount({
      relations: ['interviewStatus', 'createdByUser'],
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        createdByUser: {
          id: true,
          name: true,
          avatarUrl: true,
        },
        interviewStatus: {
          code: true,
          title: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
      where: {
        isArchived: ArchiveStatus.NOT_ARCHIVED,
      },
    });

    return {
      items: interviews,
      total,
    };
  }

  async getInterviewDetail(id: string): Promise<Interview | null> {
    return this.interviewRepository.findOne({
      where: { id },
      relations: ['interviewStatus', 'createdByUser'],
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        createdByUser: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
        interviewStatus: {
          code: true,
          title: true,
        },
      },
    });
  }

  async updateInterviewDetail(
    id: string,
    interview: Partial<Interview>,
    manager?: EntityManager,
  ): Promise<UpdateResult> {
    const repo = manager?.getRepository(Interview) ?? this.repo;

    return await repo.update({ id }, interview);
  }

  async archiveInterview(id: string): Promise<void> {
    await this.repo.update({ id }, { isArchived: ArchiveStatus.ARCHIVED });
  }
}
