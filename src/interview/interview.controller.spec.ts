import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { InterviewDI } from './di/interview.di';
import {
  mockInterviewService,
  mockUser,
  mockGetInterviewListRequestDto,
  mockGetInterviewCommentListRequestDto,
  mockGetInterviewLogListRequestDto,
  mockMutationInterviewCommentRequestDto,
  mockUpdateInterviewDetailRequestDto,
  mockInterview,
} from '../test/mocks';

describe('InterviewController', () => {
  let controller: InterviewController;
  let interviewService: jest.Mocked<InterviewService>;

  const mockRequest = {
    user: mockUser,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            name: 'long',
            ttl: 60000,
            limit: 60,
          },
          {
            name: 'medium',
            ttl: 60000,
            limit: 20,
          },
        ]),
      ],
      controllers: [InterviewController],
      providers: [
        {
          provide: InterviewDI.service,
          useValue: mockInterviewService,
        },
      ],
    }).compile();

    controller = module.get<InterviewController>(InterviewController);
    interviewService = module.get(InterviewDI.service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getInterviewList', () => {
    it('should return interview list successfully', async () => {
      const expectedResult = {
        items: [
          {
            id: mockInterview.id,
            title: mockInterview.title,
            description: mockInterview.description,
            status: 'Todo',
            createdAt: mockInterview.createdAt,
            creatorName: 'Test User',
            creatorAvatarUrl: 'https://example.com/avatar.jpg',
          },
        ],
        isLastPage: true,
        nextPage: undefined,
        limit: 10,
      };

      interviewService.getInterviewList.mockResolvedValue(expectedResult);

      const result = await controller.getInterviewList(mockGetInterviewListRequestDto);

      expect(interviewService.getInterviewList).toHaveBeenCalledWith(mockGetInterviewListRequestDto);
      expect(interviewService.getInterviewList).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Service error');
      interviewService.getInterviewList.mockRejectedValue(serviceError);

      await expect(
        controller.getInterviewList(mockGetInterviewListRequestDto),
      ).rejects.toThrow('Service error');

      expect(interviewService.getInterviewList).toHaveBeenCalledWith(mockGetInterviewListRequestDto);
    });
  });

  describe('getInterviewCommentList', () => {
    const interviewId = 'test-interview-id';

    it('should return interview comment list successfully', async () => {
      const expectedResult = {
        items: [],
        isLastPage: true,
        nextPage: undefined,
        limit: 10,
      };

      interviewService.getInterviewCommentList.mockResolvedValue(expectedResult);

      const result = await controller.getInterviewCommentList(
        interviewId,
        mockGetInterviewCommentListRequestDto,
        mockRequest,
      );

      expect(interviewService.getInterviewCommentList).toHaveBeenCalledWith(
        interviewId,
        mockGetInterviewCommentListRequestDto,
        mockUser,
      );
      expect(interviewService.getInterviewCommentList).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Comment service error');
      interviewService.getInterviewCommentList.mockRejectedValue(serviceError);

      await expect(
        controller.getInterviewCommentList(
          interviewId,
          mockGetInterviewCommentListRequestDto,
          mockRequest,
        ),
      ).rejects.toThrow('Comment service error');

      expect(interviewService.getInterviewCommentList).toHaveBeenCalledWith(
        interviewId,
        mockGetInterviewCommentListRequestDto,
        mockUser,
      );
    });
  });

  describe('getInterviewLogList', () => {
    const interviewId = 'test-interview-id';

    it('should return interview log list successfully', async () => {
      const expectedResult = {
        items: [],
        isLastPage: true,
        nextPage: undefined,
        limit: 10,
      };

      interviewService.getInterviewLogList.mockResolvedValue(expectedResult);

      const result = await controller.getInterviewLogList(
        interviewId,
        mockGetInterviewLogListRequestDto,
      );

      expect(interviewService.getInterviewLogList).toHaveBeenCalledWith(
        interviewId,
        mockGetInterviewLogListRequestDto,
      );
      expect(interviewService.getInterviewLogList).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Log service error');
      interviewService.getInterviewLogList.mockRejectedValue(serviceError);

      await expect(
        controller.getInterviewLogList(interviewId, mockGetInterviewLogListRequestDto),
      ).rejects.toThrow('Log service error');

      expect(interviewService.getInterviewLogList).toHaveBeenCalledWith(
        interviewId,
        mockGetInterviewLogListRequestDto,
      );
    });
  });

  describe('getInterviewDetail', () => {
    const interviewId = 'test-interview-id';

    it('should return interview detail successfully', async () => {
      const expectedDetailResult = {
        id: mockInterview.id,
        title: mockInterview.title,
        description: mockInterview.description,
        statusCode: mockInterview.interviewStatusCode,
        createdAt: mockInterview.createdAt,
        creatorName: 'Test User',
        creatorEmail: 'test@example.com',
        creatorAvatarUrl: 'https://example.com/avatar.jpg',
      };
      interviewService.getInterviewDetail.mockResolvedValue(expectedDetailResult);

      const result = await controller.getInterviewDetail(interviewId);

      expect(interviewService.getInterviewDetail).toHaveBeenCalledWith(interviewId);
      expect(interviewService.getInterviewDetail).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedDetailResult);
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Detail service error');
      interviewService.getInterviewDetail.mockRejectedValue(serviceError);

      await expect(controller.getInterviewDetail(interviewId)).rejects.toThrow(
        'Detail service error',
      );

      expect(interviewService.getInterviewDetail).toHaveBeenCalledWith(interviewId);
    });
  });

  describe('createInterviewComment', () => {
    const interviewId = 'test-interview-id';

    it('should create interview comment successfully', async () => {
      interviewService.createInterviewComment.mockResolvedValue(undefined);

      const result = await controller.createInterviewComment(
        interviewId,
        mockMutationInterviewCommentRequestDto,
        mockRequest,
      );

      expect(interviewService.createInterviewComment).toHaveBeenCalledWith(
        interviewId,
        mockMutationInterviewCommentRequestDto.comment,
        mockUser,
      );
      expect(interviewService.createInterviewComment).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Create comment error');
      interviewService.createInterviewComment.mockRejectedValue(serviceError);

      await expect(
        controller.createInterviewComment(
          interviewId,
          mockMutationInterviewCommentRequestDto,
          mockRequest,
        ),
      ).rejects.toThrow('Create comment error');

      expect(interviewService.createInterviewComment).toHaveBeenCalledWith(
        interviewId,
        mockMutationInterviewCommentRequestDto.comment,
        mockUser,
      );
    });
  });

  describe('updateInterviewComment', () => {
    const commentId = 'test-comment-id';

    it('should update interview comment successfully', async () => {
      interviewService.updateInterviewComment.mockResolvedValue(undefined);

      const result = await controller.updateInterviewComment(
        commentId,
        mockMutationInterviewCommentRequestDto,
        mockRequest,
      );

      expect(interviewService.updateInterviewComment).toHaveBeenCalledWith(
        commentId,
        mockMutationInterviewCommentRequestDto.comment,
        mockUser,
      );
      expect(interviewService.updateInterviewComment).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Update comment error');
      interviewService.updateInterviewComment.mockRejectedValue(serviceError);

      await expect(
        controller.updateInterviewComment(
          commentId,
          mockMutationInterviewCommentRequestDto,
          mockRequest,
        ),
      ).rejects.toThrow('Update comment error');

      expect(interviewService.updateInterviewComment).toHaveBeenCalledWith(
        commentId,
        mockMutationInterviewCommentRequestDto.comment,
        mockUser,
      );
    });
  });

  describe('updateInterviewDetail', () => {
    const interviewId = 'test-interview-id';

    it('should update interview detail successfully', async () => {
      interviewService.updateInterviewDetail.mockResolvedValue(undefined);

      const result = await controller.updateInterviewDetail(
        interviewId,
        mockUpdateInterviewDetailRequestDto,
        mockRequest,
      );

      expect(interviewService.updateInterviewDetail).toHaveBeenCalledWith(
        interviewId,
        mockUpdateInterviewDetailRequestDto,
        mockUser,
      );
      expect(interviewService.updateInterviewDetail).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Update detail error');
      interviewService.updateInterviewDetail.mockRejectedValue(serviceError);

      await expect(
        controller.updateInterviewDetail(
          interviewId,
          mockUpdateInterviewDetailRequestDto,
          mockRequest,
        ),
      ).rejects.toThrow('Update detail error');

      expect(interviewService.updateInterviewDetail).toHaveBeenCalledWith(
        interviewId,
        mockUpdateInterviewDetailRequestDto,
        mockUser,
      );
    });
  });

  describe('archiveInterview', () => {
    const interviewId = 'test-interview-id';

    it('should archive interview successfully', async () => {
      interviewService.archiveInterview.mockResolvedValue(undefined);

      const result = await controller.archiveInterview(interviewId);

      expect(interviewService.archiveInterview).toHaveBeenCalledWith(interviewId);
      expect(interviewService.archiveInterview).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Archive error');
      interviewService.archiveInterview.mockRejectedValue(serviceError);

      await expect(controller.archiveInterview(interviewId)).rejects.toThrow('Archive error');

      expect(interviewService.archiveInterview).toHaveBeenCalledWith(interviewId);
    });
  });

  describe('deleteInterviewComment', () => {
    const commentId = 'test-comment-id';

    it('should delete interview comment successfully', async () => {
      interviewService.deleteInterviewComment.mockResolvedValue(undefined);

      const result = await controller.deleteInterviewComment(commentId, mockRequest);

      expect(interviewService.deleteInterviewComment).toHaveBeenCalledWith(commentId, mockUser);
      expect(interviewService.deleteInterviewComment).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should handle service errors', async () => {
      const serviceError = new Error('Delete comment error');
      interviewService.deleteInterviewComment.mockRejectedValue(serviceError);

      await expect(controller.deleteInterviewComment(commentId, mockRequest)).rejects.toThrow(
        'Delete comment error',
      );

      expect(interviewService.deleteInterviewComment).toHaveBeenCalledWith(commentId, mockUser);
    });
  });
});