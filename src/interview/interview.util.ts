import { Interview } from 'src/entities';
import { UpdateInterviewDetailRequestDto } from 'src/interview/dto/update-interview-detail.request.dto';

export class InterviewUtil {
  static getUpdatedInterview(
    interview: Interview,
    request: UpdateInterviewDetailRequestDto,
  ): Partial<Interview> {
    const { title, description, statusCode } = request;

    const updatedInterview: Partial<Interview> = {};

    if (title !== interview.title) {
      updatedInterview.title = title;
    }

    if (description !== interview.description) {
      updatedInterview.description = description;
    }

    if (statusCode !== interview.interviewStatus.code) {
      updatedInterview.interviewStatusCode = statusCode;
    }

    return updatedInterview;
  }
}
