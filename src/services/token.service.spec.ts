import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { mockUser, mockJwtService } from '../test/mocks';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a token successfully', async () => {
      const expectedToken = 'test-jwt-token';
      jwtService.signAsync.mockResolvedValue(expectedToken);

      const result = await service.generateToken(mockUser);

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        accounts: mockUser.userAccount,
      });
      expect(jwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedToken);
    });

    it('should handle token generation errors', async () => {
      const error = new Error('Token generation failed');
      jwtService.signAsync.mockRejectedValue(error);

      await expect(service.generateToken(mockUser)).rejects.toThrow('Token generation failed');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        accounts: mockUser.userAccount,
      });
    });

    it('should include correct payload structure', async () => {
      const expectedToken = 'test-jwt-token';
      jwtService.signAsync.mockResolvedValue(expectedToken);

      await service.generateToken(mockUser);

      const expectedPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        accounts: mockUser.userAccount,
      };

      expect(jwtService.signAsync).toHaveBeenCalledWith(expectedPayload);
    });
  });

  describe('verify', () => {
    it('should verify a token successfully', () => {
      const token = 'test-jwt-token';
      const expectedPayload = {
        sub: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      };

      jwtService.verify.mockReturnValue(expectedPayload);

      const result = service.verify(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token);
      expect(jwtService.verify).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedPayload);
    });

    it('should handle token verification errors', () => {
      const token = 'invalid-token';
      const error = new Error('Invalid token');
      jwtService.verify.mockImplementation(() => {
        throw error;
      });

      expect(() => service.verify(token)).toThrow('Invalid token');
      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });

    it('should return the exact payload from JWT service', () => {
      const token = 'test-jwt-token';
      const payload = {
        sub: 'user-123',
        email: 'user@test.com',
        name: 'Test User',
        iat: 1234567890,
        exp: 1234567900,
      };

      jwtService.verify.mockReturnValue(payload);

      const result = service.verify(token);

      expect(result).toBe(payload);
      expect(result).toEqual(payload);
    });
  });
});