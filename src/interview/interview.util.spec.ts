import { InterviewUtil } from './interview.util';
import { Interview } from '../entities/interview.entity';
import { UpdateInterviewDetailRequestDto } from './dto/update-interview-detail.request.dto';
import { MasterInterviewStatusCode } from '../shared/enum/master/interview-status-code.enum';

describe('InterviewUtil', () => {
  describe('getUpdatedInterview', () => {
    const mockInterview: Interview = {
      id: 'test-interview-id',
      title: 'Original Title',
      description: 'Original Description',
      interviewStatusCode: MasterInterviewStatusCode.TODO,
      interviewStatus: {
        code: MasterInterviewStatusCode.TODO,
        title: 'Todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    } as Interview;

    it('should return empty object when no changes are needed', () => {
      const request: UpdateInterviewDetailRequestDto = {
        title: 'Original Title',
        description: 'Original Description',
        statusCode: MasterInterviewStatusCode.TODO,
      };

      const result = InterviewUtil.getUpdatedInterview(mockInterview, request);

      expect(result).toEqual({});
    });

    it('should return updated title when title is different', () => {
      const request: UpdateInterviewDetailRequestDto = {
        title: 'New Title',
        description: 'Original Description',
        statusCode: MasterInterviewStatusCode.TODO,
      };

      const result = InterviewUtil.getUpdatedInterview(mockInterview, request);

      expect(result).toEqual({
        title: 'New Title',
      });
    });

    it('should return updated description when description is different', () => {
      const request: UpdateInterviewDetailRequestDto = {
        title: 'Original Title',
        description: 'New Description',
        statusCode: MasterInterviewStatusCode.TODO,
      };

      const result = InterviewUtil.getUpdatedInterview(mockInterview, request);

      expect(result).toEqual({
        description: 'New Description',
      });
    });

    it('should return updated status code when status code is different', () => {
      const request: UpdateInterviewDetailRequestDto = {
        title: 'Original Title',
        description: 'Original Description',
        statusCode: MasterInterviewStatusCode.IN_PROGRESS,
      };

      const result = InterviewUtil.getUpdatedInterview(mockInterview, request);

      expect(result).toEqual({
        interviewStatusCode: MasterInterviewStatusCode.IN_PROGRESS,
      });
    });

    it('should return all updated fields when all are different', () => {
      const request: UpdateInterviewDetailRequestDto = {
        title: 'New Title',
        description: 'New Description',
        statusCode: MasterInterviewStatusCode.DONE,
      };

      const result = InterviewUtil.getUpdatedInterview(mockInterview, request);

      expect(result).toEqual({
        title: 'New Title',
        description: 'New Description',
        interviewStatusCode: MasterInterviewStatusCode.DONE,
      });
    });

    it('should handle partial updates correctly', () => {
      const request: UpdateInterviewDetailRequestDto = {
        title: 'New Title',
        description: 'Original Description',
        statusCode: MasterInterviewStatusCode.DONE,
      };

      const result = InterviewUtil.getUpdatedInterview(mockInterview, request);

      expect(result).toEqual({
        title: 'New Title',
        interviewStatusCode: MasterInterviewStatusCode.DONE,
      });
      expect(result).not.toHaveProperty('description');
    });

    it('should handle empty string values correctly', () => {
      const request: UpdateInterviewDetailRequestDto = {
        title: '',
        description: '',
        statusCode: MasterInterviewStatusCode.TODO,
      };

      const result = InterviewUtil.getUpdatedInterview(mockInterview, request);

      expect(result).toEqual({
        title: '',
        description: '',
      });
    });

    it('should handle null interview status gracefully', () => {
      const interviewWithNullStatus = {
        ...mockInterview,
        interviewStatus: null as any,
      };

      const request: UpdateInterviewDetailRequestDto = {
        title: 'Original Title',
        description: 'Original Description',
        statusCode: MasterInterviewStatusCode.IN_PROGRESS,
      };

      expect(() => {
        InterviewUtil.getUpdatedInterview(interviewWithNullStatus, request);
      }).toThrow();
    });
  });
});