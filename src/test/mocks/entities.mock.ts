import { User } from '../../entities/user.entity';
import { Interview } from '../../entities/interview.entity';
import { InterviewComments } from '../../entities/interview-comments.entity';
import { InterviewLogs } from '../../entities/interview-logs.entity';
import { UserAccount } from '../../entities/user-account.entity';
import { UserSession } from '../../entities/user-session.entity';
import { MasterInterviewStatusCode } from '../../shared/enum/master/interview-status-code.enum';
import { ArchiveStatus } from '../../shared/enum/archive-status.enum';

export const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: 'https://example.com/avatar.jpg',
  password: '$2b$10$hashedpassword',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  userAccount: null as unknown as UserAccount,
  userSession: null as unknown as UserSession,
  interviews: [] as Interview[],
  interviewComments: [] as InterviewComments[],
  interviewLogs: [] as InterviewLogs[],
};

export const mockUserWithSession: User = {
  ...mockUser,
  userSession: {
    id: 'session-id',
    userId: 'test-user-id',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
  },
};

export const mockInterview: Interview = {
  id: 'test-interview-id',
  title: 'Test Interview',
  description: 'Test Description',
  interviewStatusCode: MasterInterviewStatusCode.TODO,
  isArchived: ArchiveStatus.NOT_ARCHIVED,
  createdByUserId: 'test-user-id',
  createdAt: new Date('2024-01-01'),
  createdByUser: mockUser,
  interviewStatus: {
    code: MasterInterviewStatusCode.TODO,
    title: 'Todo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  interviewComments: [],
  interviewLogs: [],
};

export const mockInterviewComment: InterviewComments = {
  id: 'comment-id',
  interviewId: 'test-interview-id',
  createdByUserId: 'test-user-id',
  comment: 'Test comment',
  createdAt: new Date(),
  updatedAt: new Date(),
  interview: mockInterview,
  createdByUser: mockUser,
};

export const mockInterviewLog: InterviewLogs = {
  id: 'log-id',
  interviewId: 'test-interview-id',
  createdByUserId: 'test-user-id',
  title: 'Interview Update',
  description: 'Updated interview details',
  interviewStatusCode: MasterInterviewStatusCode.TODO,
  createdAt: new Date(),
  interview: mockInterview,
  createdByUser: mockUser,
  interviewStatus: {
    code: MasterInterviewStatusCode.TODO,
    title: 'Todo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};