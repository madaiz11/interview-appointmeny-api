import { InjectRepository } from '@nestjs/typeorm';
import { Interview } from 'src/entities/interview.entity';
import { GetInterviewListRequestDto } from 'src/interview/dto/get-interview-list.requet.dto';
import { ArchiveStatus } from 'src/shared/enum/archive-status.enum';
import { Repository } from 'typeorm';

export class InterviewRepository {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
  ) {}

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
}
