import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Interview } from 'src/entities';
import { ArchiveStatus } from 'src/shared/enum/archive-status.enum';
import { InterviewErrorCode } from 'src/shared/enum/error-codes/interview-error-code.enum';

@Injectable()
export class InterviewValidator {
  constructor() {}

  static validateInterviewExists(interview: Interview | null): void {
    if (!interview) {
      throw new NotFoundException(InterviewErrorCode.INTERVIEW_NOT_FOUND);
    }
  }

  static validateInterviewNotArchived(interview: Interview): void {
    if (interview.isArchived === ArchiveStatus.ARCHIVED) {
      throw new BadRequestException(
        InterviewErrorCode.INTERVIEW_ALREADY_ARCHIVED,
      );
    }
  }
}
