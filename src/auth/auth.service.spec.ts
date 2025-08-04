import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { TokenService } from '../services/token.service';
import { UserRepository } from '../user/repositories/user.repository';
import { UserSessionRepository } from '../user/repositories/user-session.repository';
import { UserDI } from '../user/di/user.di';
import { UserSessionDI } from '../user/di/user-session.di';
import {
  mockUser,
  mockLoginDto,
  mockUserRepository,
  mockUserSessionRepository,
  mockTokenService,
} from '../test/mocks';

// Mock the AuthValidator
jest.mock('./auth.validator', () => ({
  AuthValidator: {
    validateUserCredentials: jest.fn(),
    validatePassword: jest.fn(),
    validateUserSession: jest.fn(),
    validateUserExist: jest.fn(),
  },
}));

// Import after mock to avoid issues
import { AuthValidator } from './auth.validator';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let userSessionRepository: jest.Mocked<UserSessionRepository>;
  let tokenService: jest.Mocked<TokenService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserDI.repository,
          useValue: mockUserRepository,
        },
        {
          provide: UserSessionDI.repository,
          useValue: mockUserSessionRepository,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserDI.repository);
    userSessionRepository = module.get(UserSessionDI.repository);
    tokenService = module.get(TokenService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should successfully sign in a user with valid credentials', async () => {
      const expectedToken = 'test-jwt-token';

      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      tokenService.generateToken.mockResolvedValue(expectedToken);
      userSessionRepository.createOrUpdateUserSession.mockResolvedValue(undefined);

      (AuthValidator.validateUserCredentials as jest.Mock).mockReturnValue(undefined);
      (AuthValidator.validatePassword as jest.Mock).mockResolvedValue(undefined);
      (AuthValidator.validateUserSession as jest.Mock).mockReturnValue(undefined);

      const result = await service.signIn(mockLoginDto);

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(AuthValidator.validateUserCredentials).toHaveBeenCalledWith(mockUser);
      expect(AuthValidator.validatePassword).toHaveBeenCalledWith(mockLoginDto.password, mockUser);
      expect(AuthValidator.validateUserSession).toHaveBeenCalledWith(mockUser);
      expect(tokenService.generateToken).toHaveBeenCalledWith(mockUser);
      expect(userSessionRepository.createOrUpdateUserSession).toHaveBeenCalledWith(mockUser.id);

      expect(result).toEqual({
        access_token: expectedToken,
        token_type: 'Bearer',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          accounts: mockUser.userAccount,
        },
      });
    });

    it('should throw error when user is not found', async () => {
      userRepository.findUserByEmail.mockResolvedValue(null);
      (AuthValidator.validateUserCredentials as jest.Mock).mockImplementation(() => {
        throw new Error('User not found');
      });

      await expect(service.signIn(mockLoginDto)).rejects.toThrow('User not found');

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(AuthValidator.validateUserCredentials).toHaveBeenCalledWith(null);
      expect(tokenService.generateToken).not.toHaveBeenCalled();
      expect(userSessionRepository.createOrUpdateUserSession).not.toHaveBeenCalled();
    });

    it('should throw error when password validation fails', async () => {
      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      (AuthValidator.validateUserCredentials as jest.Mock).mockReturnValue(undefined);
      (AuthValidator.validatePassword as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid password');
      });

      await expect(service.signIn(mockLoginDto)).rejects.toThrow('Invalid password');

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(AuthValidator.validateUserCredentials).toHaveBeenCalledWith(mockUser);
      expect(AuthValidator.validatePassword).toHaveBeenCalledWith(mockLoginDto.password, mockUser);
      expect(tokenService.generateToken).not.toHaveBeenCalled();
      expect(userSessionRepository.createOrUpdateUserSession).not.toHaveBeenCalled();
    });

    it('should throw error when user session validation fails', async () => {
      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      (AuthValidator.validateUserCredentials as jest.Mock).mockReturnValue(undefined);
      (AuthValidator.validatePassword as jest.Mock).mockResolvedValue(undefined);
      (AuthValidator.validateUserSession as jest.Mock).mockImplementation(() => {
        throw new Error('User session invalid');
      });

      await expect(service.signIn(mockLoginDto)).rejects.toThrow('User session invalid');

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(AuthValidator.validateUserCredentials).toHaveBeenCalledWith(mockUser);
      expect(AuthValidator.validatePassword).toHaveBeenCalledWith(mockLoginDto.password, mockUser);
      expect(AuthValidator.validateUserSession).toHaveBeenCalledWith(mockUser);
      expect(tokenService.generateToken).not.toHaveBeenCalled();
      expect(userSessionRepository.createOrUpdateUserSession).not.toHaveBeenCalled();
    });

    it('should handle token generation failure', async () => {
      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      (AuthValidator.validateUserCredentials as jest.Mock).mockReturnValue(undefined);
      (AuthValidator.validatePassword as jest.Mock).mockResolvedValue(undefined);
      (AuthValidator.validateUserSession as jest.Mock).mockReturnValue(undefined);
      tokenService.generateToken.mockRejectedValue(new Error('Token generation failed'));

      await expect(service.signIn(mockLoginDto)).rejects.toThrow('Token generation failed');

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(tokenService.generateToken).toHaveBeenCalledWith(mockUser);
      expect(userSessionRepository.createOrUpdateUserSession).not.toHaveBeenCalled();
    });

    it('should handle user session creation failure', async () => {
      const expectedToken = 'test-jwt-token';

      userRepository.findUserByEmail.mockResolvedValue(mockUser);
      tokenService.generateToken.mockResolvedValue(expectedToken);
      userSessionRepository.createOrUpdateUserSession.mockRejectedValue(
        new Error('Session creation failed'),
      );

      (AuthValidator.validateUserCredentials as jest.Mock).mockReturnValue(undefined);
      (AuthValidator.validatePassword as jest.Mock).mockResolvedValue(undefined);
      (AuthValidator.validateUserSession as jest.Mock).mockReturnValue(undefined);

      await expect(service.signIn(mockLoginDto)).rejects.toThrow('Session creation failed');

      expect(tokenService.generateToken).toHaveBeenCalledWith(mockUser);
      expect(userSessionRepository.createOrUpdateUserSession).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('validateUser', () => {
    const userId = 'test-user-id';

    it('should successfully validate and return user', async () => {
      userRepository.findUserById.mockResolvedValue(mockUser);
      (AuthValidator.validateUserExist as jest.Mock).mockReturnValue(undefined);

      const result = await service.validateUser(userId);

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(AuthValidator.validateUserExist).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user does not exist', async () => {
      userRepository.findUserById.mockResolvedValue(null);
      (AuthValidator.validateUserExist as jest.Mock).mockImplementation(() => {
        throw new Error('User does not exist');
      });

      await expect(service.validateUser(userId)).rejects.toThrow('User does not exist');

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(AuthValidator.validateUserExist).toHaveBeenCalledWith(null);
    });

    it('should handle repository errors', async () => {
      userRepository.findUserById.mockRejectedValue(new Error('Database error'));

      await expect(service.validateUser(userId)).rejects.toThrow('Database error');

      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(AuthValidator.validateUserExist).not.toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    const userId = 'test-user-id';

    it('should successfully sign out user', async () => {
      userSessionRepository.deactivateUserSession.mockResolvedValue(undefined);

      await service.signOut(userId);

      expect(userSessionRepository.deactivateUserSession).toHaveBeenCalledWith(userId);
      expect(userSessionRepository.deactivateUserSession).toHaveBeenCalledTimes(1);
    });

    it('should handle session deactivation failure', async () => {
      userSessionRepository.deactivateUserSession.mockRejectedValue(
        new Error('Failed to deactivate session'),
      );

      await expect(service.signOut(userId)).rejects.toThrow('Failed to deactivate session');

      expect(userSessionRepository.deactivateUserSession).toHaveBeenCalledWith(userId);
    });

    it('should handle empty userId', async () => {
      const emptyUserId = '';
      userSessionRepository.deactivateUserSession.mockResolvedValue(undefined);

      await service.signOut(emptyUserId);

      expect(userSessionRepository.deactivateUserSession).toHaveBeenCalledWith(emptyUserId);
    });
  });
});