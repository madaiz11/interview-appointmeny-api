import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InterviewComments } from 'src/entities';
import { GetInterviewCommentListRequestDto } from 'src/interview/dto/get-interview-comment-list.request';
import { Repository } from 'typeorm';

@Injectable()
export class InterviewCommentsRepository {
  repo: Repository<InterviewComments>;

  constructor(
    @InjectRepository(InterviewComments)
    private readonly interviewCommentRepository: Repository<InterviewComments>,
  ) {
    this.repo = interviewCommentRepository;
  }

  async create(interviewId: string, comment: string, userId: string) {
    return this.interviewCommentRepository.save({
      interviewId,
      comment,
      createdByUserId: userId,
    });
  }

  async update(commentId: string, comment: string) {
    return this.interviewCommentRepository.update(commentId, { comment });
  }

  async getByCommentId(commentId: string) {
    return this.interviewCommentRepository.findOne({
      where: {
        id: commentId,
      },
    });
  }

  async getList(
    interviewId: string,
    currentUserId: string,
    { page, limit }: GetInterviewCommentListRequestDto,
  ): Promise<{
    items: Array<InterviewComments & { isViewOnly: boolean }>;
    total: number;
  }> {
    const baseQb = this.interviewCommentRepository
      .createQueryBuilder('interviewComment')
      .leftJoin('interviewComment.createdByUser', 'createdByUser')
      .where('interviewComment.interviewId = :interviewId', { interviewId })
      .setParameters({ currentUserId });

    const dataQb = baseQb
      .clone()
      .select([
        'interviewComment.id as id',
        'interviewComment.comment as comment',
        'interviewComment.createdAt as createdAt',
        'interviewComment.updatedAt as updatedAt',
        'createdByUser.id as "createdByUser_id"',
        'createdByUser.name as "createdByUser_name"',
        'createdByUser.avatarUrl as "createdByUser_avatarUrl"',
        'CASE WHEN createdByUser.id = :currentUserId THEN false ELSE true END as is_view_only',
      ])
      .orderBy('interviewComment.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const countQb = this.interviewCommentRepository
      .createQueryBuilder('interviewComment')
      .where('interviewComment.interviewId = :interviewId', { interviewId });

    const [items, total] = await Promise.all([
      dataQb.getRawMany(),
      countQb.getCount(),
    ]);

    const transformedItems = items.map((item) => ({
      id: item.id,
      comment: item.comment,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      isViewOnly: Boolean(item.is_view_only),
      createdByUser: {
        id: item.createdByUser_id,
        name: item.createdByUser_name,
        avatarUrl: item.createdByUser_avatarUrl,
      },
    }));

    return {
      items: transformedItems as Array<InterviewComments & { isViewOnly: boolean }>,
      total,
    };
  }
}
