import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { mockAuthService, mockUser, mockLoginDto } from '../test/mocks';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            name: 'short',
            ttl: 60000,
            limit: 5,
          },
          {
            name: 'medium',
            ttl: 60000,
            limit: 10,
          },
        ]),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should successfully sign in a user with valid credentials', async () => {
      const expectedResult = {
        access_token: 'test-jwt-token',
        token_type: 'Bearer',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          accounts: mockUser.userAccount,
        },
      };

      authService.signIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(mockLoginDto);

      expect(authService.signIn).toHaveBeenCalledWith(mockLoginDto);
      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle authentication errors from service', async () => {
      const authError = new Error('Invalid credentials');
      authService.signIn.mockRejectedValue(authError);

      await expect(controller.signIn(mockLoginDto)).rejects.toThrow(
        'Invalid credentials',
      );

      expect(authService.signIn).toHaveBeenCalledWith(mockLoginDto);
      expect(authService.signIn).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid login data', async () => {
      const invalidLoginDto = {
        email: 'invalid-email',
        password: '',
      };

      const validationError = new Error('Invalid input data');
      authService.signIn.mockRejectedValue(validationError);

      await expect(controller.signIn(invalidLoginDto)).rejects.toThrow(
        'Invalid input data',
      );

      expect(authService.signIn).toHaveBeenCalledWith(invalidLoginDto);
    });
  });

  describe('signOut', () => {
    const mockRequest = {
      user: mockUser,
    } as any;

    it('should successfully sign out a user', async () => {
      authService.signOut.mockResolvedValue(undefined);

      const result = await controller.signOut(mockRequest);

      expect(authService.signOut).toHaveBeenCalledWith(mockUser.id);
      expect(authService.signOut).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should handle sign out errors', async () => {
      const signOutError = new Error('Failed to sign out');
      authService.signOut.mockRejectedValue(signOutError);

      await expect(controller.signOut(mockRequest)).rejects.toThrow(
        'Failed to sign out',
      );

      expect(authService.signOut).toHaveBeenCalledWith(mockUser.id);
      expect(authService.signOut).toHaveBeenCalledTimes(1);
    });

    it('should handle missing user in request', async () => {
      const requestWithoutUser = {} as any;

      await expect(
        controller.signOut(requestWithoutUser),
      ).rejects.toThrow();
    });
  });

  describe('getProfile', () => {
    const mockRequest = {
      user: mockUser,
    } as any;

    it('should return the authenticated user profile', () => {
      const result = controller.getProfile(mockRequest);

      expect(result).toEqual(mockUser);
    });

    it('should return user data directly from request', () => {
      const customUser = {
        id: 'custom-user-id',
        email: 'custom@example.com',
        name: 'Custom User',
      };

      const customRequest = {
        user: customUser,
      } as any;

      const result = controller.getProfile(customRequest);

      expect(result).toEqual(customUser);
    });

    it('should handle request without user', () => {
      const requestWithoutUser = {} as any;

      const result = controller.getProfile(requestWithoutUser);

      expect(result).toBeUndefined();
    });
  });
});