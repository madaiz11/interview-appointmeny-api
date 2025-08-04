import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { mockHealthService } from '../test/mocks';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: jest.Mocked<HealthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            name: 'long',
            ttl: 60000,
            limit: 100,
          },
        ]),
      ],
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthService = module.get(HealthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkHealth', () => {
    it('should return health status', async () => {
      const expectedResult = {
        status: 'ok',
        timestamp: '2024-01-01T00:00:00.000Z',
        environment: 'test',
        version: '1.0.0',
      };

      healthService.checkHealth.mockReturnValue(expectedResult);

      const result = controller.getHealth();

      expect(healthService.checkHealth).toHaveBeenCalled();
      expect(healthService.checkHealth).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('checkDatabaseHealth', () => {
    it('should return database health status when connected', async () => {
      const expectedResult = {
        status: 'ok',
        database: {
          type: 'postgresql',
          connected: true,
        },
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      healthService.checkDatabaseHealth.mockResolvedValue(expectedResult);

      const result = await controller.getDatabaseHealth();

      expect(healthService.checkDatabaseHealth).toHaveBeenCalled();
      expect(healthService.checkDatabaseHealth).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should return database health status when connection fails', async () => {
      const expectedResult = {
        status: 'error',
        database: {
          type: 'postgresql',
          connected: false,
          error: 'Connection failed',
        },
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      healthService.checkDatabaseHealth.mockResolvedValue(expectedResult);

      const result = await controller.getDatabaseHealth();

      expect(healthService.checkDatabaseHealth).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});