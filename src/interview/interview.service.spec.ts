import { Test, TestingModule } from '@nestjs/testing';
import { InterviewService } from './interview.service';
import { InterviewDI } from './di/interview.di';
import { InterviewLogsDI } from './di/interview-logs.di';
import { InterviewCommentsDI } from './di/interview-comments.di';
import { InterviewRepository } from './reporitories/interview.repository';
import { InterviewLogsRepository } from './reporitories/interview-logs.repository';
import { InterviewCommentsRepository } from './reporitories/interview-comments.repoitory';
import { InterviewValidator } from './validators/interview.validator';
import { InterviewCommentValidator } from './validators/interview-comment.validator';
import { InterviewMapper } from './mapper/interview.mapper';
import { InterviewLogsMapper } from './mapper/interview-logs.mapper';
import { InterviewCommentsMapper } from './mapper/interview-comments.mapper';
import { InterviewUtil } from './interview.util';
import {
  mockUser,
  mockInterview,
  mockInterviewComment,
  mockInterviewRepository,
  mockInterviewLogsRepository,
  mockInterviewCommentsRepository,
  mockGetInterviewListRequestDto,
  mockGetInterviewCommentListRequestDto,
  mockGetInterviewLogListRequestDto,
  mockUpdateInterviewDetailRequestDto,
} from '../test/mocks';

// Mock the validators
jest.mock('./validators/interview.validator', () => ({
  InterviewValidator: {
    validateInterviewExists: jest.fn(),
    validateInterviewNotArchived: jest.fn(),
    validateInterviewAllowedToUpdate: jest.fn(),
  },
}));

jest.mock('./validators/interview-comment.validator', () => ({
  InterviewCommentValidator: {
    validateInterviewCommentExists: jest.fn(),
    validateInterviewCommentAllowedToUpdate: jest.fn(),
  },
}));

// Mock the mappers
jest.mock('./mapper/interview.mapper', () => ({
  InterviewMapper: {
    toGetInterviewListResponseDto: jest.fn(),
    toGetInterviewDetailResponseDto: jest.fn(),
  },
}));

jest.mock('./mapper/interview-logs.mapper', () => ({
  InterviewLogsMapper: {
    toGetInterviewLogListResponseDto: jest.fn(),
  },
}));

jest.mock('./mapper/interview-comments.mapper', () => ({
  InterviewCommentsMapper: {
    toGetInterviewCommentListResponseDto: jest.fn(),
  },
}));

// Mock the utility
jest.mock('./interview.util', () => ({
  InterviewUtil: {
    getUpdatedInterview: jest.fn(),
  },
}));

describe('InterviewService', () => {
  let service: InterviewService;
  let interviewRepository: jest.Mocked<InterviewRepository>;
  let interviewLogsRepository: jest.Mocked<InterviewLogsRepository>;
  let interviewCommentsRepository: jest.Mocked<InterviewCommentsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterviewService,
        {
          provide: InterviewDI.repository,
          useValue: mockInterviewRepository,
        },
        {
          provide: InterviewLogsDI.repository,
          useValue: mockInterviewLogsRepository,
        },
        {
          provide: InterviewCommentsDI.repository,
          useValue: mockInterviewCommentsRepository,
        },
      ],
    }).compile();

    service = module.get<InterviewService>(InterviewService);
    interviewRepository = module.get(InterviewDI.repository);
    interviewLogsRepository = module.get(InterviewLogsDI.repository);
    interviewCommentsRepository = module.get(InterviewCommentsDI.repository);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getInterviewList', () => {
    it('should return mapped interview list', async () => {
      const repositoryResult = {
        items: [mockInterview],
        total: 1,
      };
      const expectedMappedResult = {
        items: [mockInterview],
        isLastPage: true,
        nextPage: undefined,
        limit: 10,
      };

      interviewRepository.getInterviewList.mockResolvedValue(repositoryResult);
      (InterviewMapper.toGetInterviewListResponseDto as jest.Mock).mockReturnValue(expectedMappedResult);

      const result = await service.getInterviewList(mockGetInterviewListRequestDto);

      expect(interviewRepository.getInterviewList).toHaveBeenCalledWith(mockGetInterviewListRequestDto);
      expect(InterviewMapper.toGetInterviewListResponseDto).toHaveBeenCalledWith(
        repositoryResult.items,
        repositoryResult.total,
        mockGetInterviewListRequestDto.page,
        mockGetInterviewListRequestDto.limit,
      );
      expect(result).toEqual(expectedMappedResult);
    });

    it('should handle repository errors', async () => {
      const repositoryError = new Error('Repository error');
      interviewRepository.getInterviewList.mockRejectedValue(repositoryError);

      await expect(service.getInterviewList(mockGetInterviewListRequestDto)).rejects.toThrow('Repository error');

      expect(interviewRepository.getInterviewList).toHaveBeenCalledWith(mockGetInterviewListRequestDto);
      expect(InterviewMapper.toGetInterviewListResponseDto).not.toHaveBeenCalled();
    });
  });

  describe('getInterviewDetail', () => {
    const interviewId = 'test-interview-id';

    it('should return mapped interview detail', async () => {
      const expectedMappedResult = mockInterview;

      interviewRepository.getInterviewDetail.mockResolvedValue(mockInterview);
      (InterviewValidator.validateInterviewExists as jest.Mock).mockReturnValue(undefined);
      (InterviewValidator.validateInterviewNotArchived as jest.Mock).mockReturnValue(undefined);
      (InterviewMapper.toGetInterviewDetailResponseDto as jest.Mock).mockReturnValue(expectedMappedResult);

      const result = await service.getInterviewDetail(interviewId);

      expect(interviewRepository.getInterviewDetail).toHaveBeenCalledWith(interviewId);
      expect(InterviewValidator.validateInterviewExists).toHaveBeenCalledWith(mockInterview);
      expect(InterviewValidator.validateInterviewNotArchived).toHaveBeenCalledWith(mockInterview);
      expect(InterviewMapper.toGetInterviewDetailResponseDto).toHaveBeenCalledWith(mockInterview);
      expect(result).toEqual(expectedMappedResult);
    });

    it('should throw error when interview does not exist', async () => {
      interviewRepository.getInterviewDetail.mockResolvedValue(null);
      (InterviewValidator.validateInterviewExists as jest.Mock).mockImplementation(() => {
        throw new Error('Interview not found');
      });

      await expect(service.getInterviewDetail(interviewId)).rejects.toThrow('Interview not found');

      expect(interviewRepository.getInterviewDetail).toHaveBeenCalledWith(interviewId);
      expect(InterviewValidator.validateInterviewExists).toHaveBeenCalledWith(null);
      expect(InterviewMapper.toGetInterviewDetailResponseDto).not.toHaveBeenCalled();
    });

    it('should throw error when interview is archived', async () => {
      interviewRepository.getInterviewDetail.mockResolvedValue(mockInterview);
      (InterviewValidator.validateInterviewExists as jest.Mock).mockReturnValue(undefined);
      (InterviewValidator.validateInterviewNotArchived as jest.Mock).mockImplementation(() => {
        throw new Error('Interview is archived');
      });

      await expect(service.getInterviewDetail(interviewId)).rejects.toThrow('Interview is archived');

      expect(InterviewValidator.validateInterviewNotArchived).toHaveBeenCalledWith(mockInterview);
      expect(InterviewMapper.toGetInterviewDetailResponseDto).not.toHaveBeenCalled();
    });
  });

  describe('updateInterviewDetail', () => {
    const interviewId = 'test-interview-id';
    const updatedInterview = { title: 'Updated Title' };

    it('should update interview detail successfully', async () => {
      const mockManager = {
        transaction: jest.fn().mockImplementation(async (callback) => await callback(mockManager)),
      };

      interviewRepository.getInterviewDetail.mockResolvedValue(mockInterview);
      interviewRepository.updateInterviewDetail.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });
      interviewRepository.repo = { manager: mockManager } as any;
      
      (InterviewValidator.validateInterviewExists as jest.Mock).mockReturnValue(undefined);
      (InterviewValidator.validateInterviewNotArchived as jest.Mock).mockReturnValue(undefined);
      (InterviewValidator.validateInterviewAllowedToUpdate as jest.Mock).mockReturnValue(undefined);
      (InterviewUtil.getUpdatedInterview as jest.Mock).mockReturnValue(updatedInterview);

      await service.updateInterviewDetail(interviewId, mockUpdateInterviewDetailRequestDto, mockUser);

      expect(interviewRepository.getInterviewDetail).toHaveBeenCalledWith(interviewId);
      expect(InterviewValidator.validateInterviewExists).toHaveBeenCalledWith(mockInterview);
      expect(InterviewValidator.validateInterviewNotArchived).toHaveBeenCalledWith(mockInterview);
      expect(InterviewValidator.validateInterviewAllowedToUpdate).toHaveBeenCalledWith(mockInterview, mockUser);
      expect(InterviewUtil.getUpdatedInterview).toHaveBeenCalledWith(mockInterview, mockUpdateInterviewDetailRequestDto);
      expect(interviewRepository.updateInterviewDetail).toHaveBeenCalledWith(interviewId, updatedInterview, mockManager);
      expect(interviewLogsRepository.createInterviewLog).toHaveBeenCalledWith(
        interviewId,
        mockUpdateInterviewDetailRequestDto,
        mockUser,
        mockManager,
      );
    });

    it('should not create log when no rows affected', async () => {
      const mockManager = {
        transaction: jest.fn().mockImplementation(async (callback) => await callback(mockManager)),
      };

      interviewRepository.getInterviewDetail.mockResolvedValue(mockInterview);
      interviewRepository.updateInterviewDetail.mockResolvedValue({ affected: 0, raw: [], generatedMaps: [] });
      interviewRepository.repo = { manager: mockManager } as any;
      
      (InterviewValidator.validateInterviewExists as jest.Mock).mockReturnValue(undefined);
      (InterviewValidator.validateInterviewNotArchived as jest.Mock).mockReturnValue(undefined);
      (InterviewValidator.validateInterviewAllowedToUpdate as jest.Mock).mockReturnValue(undefined);
      (InterviewUtil.getUpdatedInterview as jest.Mock).mockReturnValue(updatedInterview);

      await service.updateInterviewDetail(interviewId, mockUpdateInterviewDetailRequestDto, mockUser);

      expect(interviewRepository.updateInterviewDetail).toHaveBeenCalledWith(interviewId, updatedInterview, mockManager);
      expect(interviewLogsRepository.createInterviewLog).not.toHaveBeenCalled();
    });

    it('should throw error when interview validation fails', async () => {
      interviewRepository.getInterviewDetail.mockResolvedValue(null);
      (InterviewValidator.validateInterviewExists as jest.Mock).mockImplementation(() => {
        throw new Error('Interview not found');
      });

      await expect(
        service.updateInterviewDetail(interviewId, mockUpdateInterviewDetailRequestDto, mockUser),
      ).rejects.toThrow('Interview not found');

      expect(InterviewUtil.getUpdatedInterview).not.toHaveBeenCalled();
    });
  });

  describe('archiveInterview', () => {
    const interviewId = 'test-interview-id';

    it('should archive interview successfully', async () => {
      interviewRepository.getInterviewDetail.mockResolvedValue(mockInterview);
      interviewRepository.archiveInterview.mockResolvedValue(undefined);
      
      (InterviewValidator.validateInterviewExists as jest.Mock).mockReturnValue(undefined);
      (InterviewValidator.validateInterviewNotArchived as jest.Mock).mockReturnValue(undefined);

      await service.archiveInterview(interviewId);

      expect(interviewRepository.getInterviewDetail).toHaveBeenCalledWith(interviewId);
      expect(InterviewValidator.validateInterviewExists).toHaveBeenCalledWith(mockInterview);
      expect(InterviewValidator.validateInterviewNotArchived).toHaveBeenCalledWith(mockInterview);
      expect(interviewRepository.archiveInterview).toHaveBeenCalledWith(interviewId);
    });

    it('should throw error when interview does not exist', async () => {
      interviewRepository.getInterviewDetail.mockResolvedValue(null);
      (InterviewValidator.validateInterviewExists as jest.Mock).mockImplementation(() => {
        throw new Error('Interview not found');
      });

      await expect(service.archiveInterview(interviewId)).rejects.toThrow('Interview not found');

      expect(interviewRepository.archiveInterview).not.toHaveBeenCalled();
    });
  });

  describe('getInterviewLogList', () => {
    const interviewId = 'test-interview-id';

    it('should return mapped interview log list', async () => {
      const repositoryResult = { items: [], total: 0 };
      const expectedMappedResult = {
        items: [],
        isLastPage: true,
        nextPage: undefined,
        limit: 10,
      };

      interviewLogsRepository.getInterviewLogs.mockResolvedValue(repositoryResult);
      (InterviewLogsMapper.toGetInterviewLogListResponseDto as jest.Mock).mockReturnValue(expectedMappedResult);

      const result = await service.getInterviewLogList(interviewId, mockGetInterviewLogListRequestDto);

      expect(interviewLogsRepository.getInterviewLogs).toHaveBeenCalledWith(interviewId, mockGetInterviewLogListRequestDto);
      expect(InterviewLogsMapper.toGetInterviewLogListResponseDto).toHaveBeenCalledWith(
        repositoryResult.items,
        repositoryResult.total,
        mockGetInterviewLogListRequestDto.page,
        mockGetInterviewLogListRequestDto.limit,
      );
      expect(result).toEqual(expectedMappedResult);
    });
  });

  describe('getInterviewCommentList', () => {
    const interviewId = 'test-interview-id';

    it('should return mapped interview comment list', async () => {
      const repositoryResult = { items: [], total: 0 };
      const expectedMappedResult = {
        items: [],
        isLastPage: true,
        nextPage: undefined,
        limit: 10,
      };

      interviewCommentsRepository.getList.mockResolvedValue(repositoryResult);
      (InterviewCommentsMapper.toGetInterviewCommentListResponseDto as jest.Mock).mockReturnValue(expectedMappedResult);

      const result = await service.getInterviewCommentList(interviewId, mockGetInterviewCommentListRequestDto, mockUser);

      expect(interviewCommentsRepository.getList).toHaveBeenCalledWith(
        interviewId,
        mockUser.id,
        mockGetInterviewCommentListRequestDto,
      );
      expect(InterviewCommentsMapper.toGetInterviewCommentListResponseDto).toHaveBeenCalledWith(
        repositoryResult.items,
        repositoryResult.total,
        mockGetInterviewCommentListRequestDto.page,
        mockGetInterviewCommentListRequestDto.limit,
      );
      expect(result).toEqual(expectedMappedResult);
    });
  });

  describe('createInterviewComment', () => {
    const interviewId = 'test-interview-id';
    const comment = 'Test comment';

    it('should create interview comment successfully', async () => {
      interviewRepository.getInterviewDetail.mockResolvedValue(mockInterview);
      interviewCommentsRepository.create.mockResolvedValue({
        id: 'comment-id',
        interviewId: 'test-interview-id',
        comment: 'Test comment',
        createdByUserId: mockUser.id,
      } as any);
      
      (InterviewValidator.validateInterviewExists as jest.Mock).mockReturnValue(undefined);
      (InterviewValidator.validateInterviewNotArchived as jest.Mock).mockReturnValue(undefined);

      await service.createInterviewComment(interviewId, comment, mockUser);

      expect(interviewRepository.getInterviewDetail).toHaveBeenCalledWith(interviewId);
      expect(InterviewValidator.validateInterviewExists).toHaveBeenCalledWith(mockInterview);
      expect(InterviewValidator.validateInterviewNotArchived).toHaveBeenCalledWith(mockInterview);
      expect(interviewCommentsRepository.create).toHaveBeenCalledWith(interviewId, comment, mockUser.id);
    });

    it('should throw error when interview validation fails', async () => {
      interviewRepository.getInterviewDetail.mockResolvedValue(null);
      (InterviewValidator.validateInterviewExists as jest.Mock).mockImplementation(() => {
        throw new Error('Interview not found');
      });

      await expect(service.createInterviewComment(interviewId, comment, mockUser)).rejects.toThrow('Interview not found');

      expect(interviewCommentsRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateInterviewComment', () => {
    const commentId = 'test-comment-id';
    const comment = 'Updated comment';

    it('should update interview comment successfully', async () => {
      interviewCommentsRepository.getByCommentId.mockResolvedValue(mockInterviewComment);
      interviewCommentsRepository.update.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });
      
      (InterviewCommentValidator.validateInterviewCommentExists as jest.Mock).mockReturnValue(undefined);
      (InterviewCommentValidator.validateInterviewCommentAllowedToUpdate as jest.Mock).mockReturnValue(undefined);

      await service.updateInterviewComment(commentId, comment, mockUser);

      expect(interviewCommentsRepository.getByCommentId).toHaveBeenCalledWith(commentId);
      expect(InterviewCommentValidator.validateInterviewCommentExists).toHaveBeenCalledWith(mockInterviewComment);
      expect(InterviewCommentValidator.validateInterviewCommentAllowedToUpdate).toHaveBeenCalledWith(
        mockInterviewComment,
        mockUser,
      );
      expect(interviewCommentsRepository.update).toHaveBeenCalledWith(commentId, comment);
    });

    it('should throw error when comment does not exist', async () => {
      interviewCommentsRepository.getByCommentId.mockResolvedValue(null);
      (InterviewCommentValidator.validateInterviewCommentExists as jest.Mock).mockImplementation(() => {
        throw new Error('Comment not found');
      });

      await expect(service.updateInterviewComment(commentId, comment, mockUser)).rejects.toThrow('Comment not found');

      expect(interviewCommentsRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteInterviewComment', () => {
    const commentId = 'test-comment-id';

    it('should delete interview comment successfully', async () => {
      const mockRepo = { delete: jest.fn().mockResolvedValue({ affected: 1, raw: [] }) };
      
      interviewCommentsRepository.getByCommentId.mockResolvedValue(mockInterviewComment);
      interviewCommentsRepository.repo = mockRepo as any;
      
      (InterviewCommentValidator.validateInterviewCommentExists as jest.Mock).mockReturnValue(undefined);
      (InterviewCommentValidator.validateInterviewCommentAllowedToUpdate as jest.Mock).mockReturnValue(undefined);

      await service.deleteInterviewComment(commentId, mockUser);

      expect(interviewCommentsRepository.getByCommentId).toHaveBeenCalledWith(commentId);
      expect(InterviewCommentValidator.validateInterviewCommentExists).toHaveBeenCalledWith(mockInterviewComment);
      expect(InterviewCommentValidator.validateInterviewCommentAllowedToUpdate).toHaveBeenCalledWith(
        mockInterviewComment,
        mockUser,
      );
      expect(mockRepo.delete).toHaveBeenCalledWith(commentId);
    });

    it('should throw error when comment validation fails', async () => {
      interviewCommentsRepository.getByCommentId.mockResolvedValue(null);
      (InterviewCommentValidator.validateInterviewCommentExists as jest.Mock).mockImplementation(() => {
        throw new Error('Comment not found');
      });

      await expect(service.deleteInterviewComment(commentId, mockUser)).rejects.toThrow('Comment not found');

      expect(interviewCommentsRepository.repo.delete).not.toHaveBeenCalled();
    });
  });
});