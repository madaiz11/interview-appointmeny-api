import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InterviewComments, User } from 'src/entities';
import { InterviewErrorCode } from 'src/shared/enum/error-codes/interview-error-code.enum';

export class InterviewCommentValidator {
  static validateInterviewCommentExists(
    interviewComment: InterviewComments | null,
  ): void {
    if (!interviewComment) {
      throw new NotFoundException(
        InterviewErrorCode.INTERVIEW_COMMENT_NOT_FOUND,
      );
    }
  }

  static validateInterviewCommentAllowedToUpdate(
    interviewComment: InterviewComments,
    currentUser: User,
  ): void {
    const createdUserId =
      interviewComment?.createdByUser?.id ?? interviewComment?.createdByUserId;
    if (createdUserId !== currentUser.id) {
      throw new BadRequestException(
        InterviewErrorCode.INTERVIEW_COMMENT_NOT_ALLOWED_TO_UPDATE,
      );
    }
  }
}
