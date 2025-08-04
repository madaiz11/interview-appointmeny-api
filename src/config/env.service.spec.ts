import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EnvService } from './env.service';
import { mockConfigService } from '../test/mocks';

describe('EnvService', () => {
  let service: EnvService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EnvService>(EnvService);
    configService = module.get<ConfigService>(ConfigService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Database Configuration', () => {
    it('should return correct postgres host', () => {
      expect(service.postgresHost).toBe('localhost');
      expect(configService.get).toHaveBeenCalledWith('POSTGRES_HOST');
    });

    it('should return default postgres host when not configured', () => {
      mockConfigService.get.mockReturnValue(undefined);
      expect(service.postgresHost).toBe('localhost');
    });

    it('should return correct postgres port', () => {
      expect(service.postgresPort).toBe(5432);
      expect(configService.get).toHaveBeenCalledWith('POSTGRES_PORT');
    });

    it('should return default postgres port when not configured', () => {
      mockConfigService.get.mockReturnValue(undefined);
      expect(service.postgresPort).toBe(5432);
    });

    it('should return correct postgres user', () => {
      expect(service.postgresUser).toBe('postgres');
      expect(configService.get).toHaveBeenCalledWith('POSTGRES_USER');
    });

    it('should return correct postgres password', () => {
      expect(service.postgresPassword).toBe('postgres');
      expect(configService.get).toHaveBeenCalledWith('POSTGRES_PASSWORD');
    });

    it('should return correct postgres database', () => {
      expect(service.postgresDatabase).toBe('interview_appointment');
      expect(configService.get).toHaveBeenCalledWith('POSTGRES_DB');
    });

    it('should return default postgres database when not configured', () => {
      mockConfigService.get.mockReturnValue(undefined);
      expect(service.postgresDatabase).toBe('interview_appointment');
    });
  });

  describe('Application Configuration', () => {
    it('should return correct app port', () => {
      expect(service.appPort).toBe(3000);
      expect(configService.get).toHaveBeenCalledWith('APP_PORT');
    });

    it('should return default app port when not configured', () => {
      mockConfigService.get.mockReturnValue(undefined);
      expect(service.appPort).toBe(3000);
    });

    it('should return correct node environment', () => {
      expect(service.nodeEnv).toBe('development');
      expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
    });

    it('should return default node environment when not configured', () => {
      mockConfigService.get.mockReturnValue(undefined);
      expect(service.nodeEnv).toBe('development');
    });
  });

  describe('JWT Configuration', () => {
    it('should return correct JWT secret', () => {
      expect(service.jwtSecret).toBe('default-secret');
      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    });

    it('should return default JWT secret when not configured', () => {
      mockConfigService.get.mockReturnValue(undefined);
      expect(service.jwtSecret).toBe('default-secret');
    });

    it('should return correct JWT expiration', () => {
      expect(service.jwtExpiration).toBe('1d');
      expect(configService.get).toHaveBeenCalledWith('JWT_EXPIRATION');
    });

    it('should return default JWT expiration when not configured', () => {
      mockConfigService.get.mockReturnValue(undefined);
      expect(service.jwtExpiration).toBe('1d');
    });
  });

  describe('Helper Methods', () => {
    it('should correctly identify development environment', () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'development';
        return 'default-value';
      });

      expect(service.isDevelopment).toBe(true);
      expect(service.isProduction).toBe(false);
      expect(service.isTest).toBe(false);
    });

    it('should correctly identify production environment', () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'production';
        return 'default-value';
      });

      expect(service.isDevelopment).toBe(false);
      expect(service.isProduction).toBe(true);
      expect(service.isTest).toBe(false);
    });

    it('should correctly identify test environment', () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return 'test';
        return 'default-value';
      });

      expect(service.isDevelopment).toBe(false);
      expect(service.isProduction).toBe(false);
      expect(service.isTest).toBe(true);
    });

    it('should return correct database URL', () => {
      const expectedUrl = 'postgresql://default-value:default-value@default-value:default-value/default-value';
      expect(service.databaseUrl).toBe(expectedUrl);
    });

    it('should handle different database configurations in URL', () => {
      mockConfigService.get.mockImplementation((key: string) => {
        const config = {
          POSTGRES_HOST: 'db.example.com',
          POSTGRES_PORT: 5433,
          POSTGRES_USER: 'myuser',
          POSTGRES_PASSWORD: 'mypass',
          POSTGRES_DB: 'mydb',
        };
        return config[key];
      });

      const expectedUrl = 'postgresql://myuser:mypass@db.example.com:5433/mydb';
      expect(service.databaseUrl).toBe(expectedUrl);
    });
  });
});