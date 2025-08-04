import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { mockUser, mockInterview } from './entities.mock';

// JWT Service Mock
export const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('test-jwt-token'),
  verify: jest.fn().mockReturnValue({
    sub: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  }),
};

// Config Service Mock
export const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      POSTGRES_HOST: 'localhost',
      POSTGRES_PORT: 5432,
      POSTGRES_USER: 'postgres',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_DB: 'test_db',
      APP_PORT: 3000,
      NODE_ENV: 'test',
      JWT_SECRET: 'test-secret',
      JWT_EXPIRATION: '1d',
    };
    return config[key];
  }),
};

// DataSource Mock
export const mockDataSource = {
  query: jest.fn().mockResolvedValue([{ result: 1 }]),
  isInitialized: true,
  manager: {
    transaction: jest.fn().mockImplementation(async (callback) => {
      const mockManager = createMockEntityManager();
      return await callback(mockManager);
    }),
  },
};

// Entity Manager Mock
export const createMockEntityManager = (): Partial<EntityManager> => ({
  save: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
  findOne: jest.fn().mockResolvedValue(mockUser),
  find: jest.fn().mockResolvedValue([]),
  transaction: jest.fn(),
});

// Repository Mock Factory
export const createMockRepository = <T>(entity?: Partial<T>) => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  findOneBy: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
  create: jest.fn().mockReturnValue(entity),
  manager: createMockEntityManager(),
});

// User Repository Mock
export const mockUserRepository = {
  findUserByEmail: jest.fn().mockResolvedValue(mockUser),
  findUserById: jest.fn().mockResolvedValue(mockUser),
  repo: createMockRepository(mockUser),
};

// User Session Repository Mock
export const mockUserSessionRepository = {
  createOrUpdateUserSession: jest.fn().mockResolvedValue({}),
  deactivateUserSession: jest.fn().mockResolvedValue({}),
  repo: createMockRepository(),
};

// Interview Repository Mock
export const mockInterviewRepository = {
  getInterviewList: jest.fn().mockResolvedValue({
    items: [mockInterview],
    total: 1,
  }),
  getInterviewDetail: jest.fn().mockResolvedValue(mockInterview),
  updateInterviewDetail: jest.fn().mockResolvedValue({ affected: 1 }),
  archiveInterview: jest.fn().mockResolvedValue({}),
  repo: createMockRepository(mockInterview),
};

// Interview Comments Repository Mock
export const mockInterviewCommentsRepository = {
  getList: jest.fn().mockResolvedValue({
    items: [],
    total: 0,
  }),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  getByCommentId: jest.fn().mockResolvedValue(null),
  repo: createMockRepository(),
};

// Interview Logs Repository Mock
export const mockInterviewLogsRepository = {
  getInterviewLogs: jest.fn().mockResolvedValue({
    items: [],
    total: 0,
  }),
  createInterviewLog: jest.fn().mockResolvedValue({}),
  repo: createMockRepository(),
};

// Express Request Mock
export const mockRequest = {
  user: mockUser,
};

// Token Service Mock
export const mockTokenService = {
  generateToken: jest.fn().mockResolvedValue('test-jwt-token'),
  verify: jest.fn().mockReturnValue({
    sub: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  }),
};

// Auth Service Mock
export const mockAuthService = {
  signIn: jest.fn().mockResolvedValue({
    access_token: 'test-jwt-token',
    token_type: 'Bearer',
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      accounts: mockUser.userAccount,
    },
  }),
  validateUser: jest.fn().mockResolvedValue(mockUser),
  signOut: jest.fn().mockResolvedValue(undefined),
};

// Health Service Mock
export const mockHealthService = {
  checkHealth: jest.fn().mockReturnValue({
    status: 'ok',
    timestamp: '2024-01-01T00:00:00.000Z',
    environment: 'test',
    version: '1.0.0',
  }),
  checkDatabaseHealth: jest.fn().mockResolvedValue({
    status: 'ok',
    database: {
      type: 'postgresql',
      connected: true,
    },
    timestamp: '2024-01-01T00:00:00.000Z',
  }),
};

// Interview Service Mock
export const mockInterviewService = {
  getInterviewList: jest.fn().mockResolvedValue({
    items: [mockInterview],
    isLastPage: true,
    nextPage: undefined,
    limit: 10,
  }),
  getInterviewDetail: jest.fn().mockResolvedValue(mockInterview),
  updateInterviewDetail: jest.fn().mockResolvedValue(undefined),
  archiveInterview: jest.fn().mockResolvedValue(undefined),
  getInterviewLogList: jest.fn().mockResolvedValue({
    items: [],
    isLastPage: true,
    nextPage: undefined,
    limit: 10,
  }),
  getInterviewCommentList: jest.fn().mockResolvedValue({
    items: [],
    isLastPage: true,
    nextPage: undefined,
    limit: 10,
  }),
  createInterviewComment: jest.fn().mockResolvedValue(undefined),
  updateInterviewComment: jest.fn().mockResolvedValue(undefined),
  deleteInterviewComment: jest.fn().mockResolvedValue(undefined),
};

// EnvService Mock
export const mockEnvService = {
  nodeEnv: 'test',
  postgresHost: 'localhost',
  postgresPort: 5432,
  isDevelopment: false,
  isProduction: false,
  isTest: true,
};

// Express Response Mock
export const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
};