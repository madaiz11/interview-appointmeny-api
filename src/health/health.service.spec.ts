import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HealthService } from './health.service';
import { EnvService } from '../config/env.service';
import { mockDataSource, mockEnvService } from '../test/mocks';

describe('HealthService', () => {
  let service: HealthService;
  let dataSource: jest.Mocked<DataSource>;
  let envService: jest.Mocked<EnvService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
        {
          provide: EnvService,
          useValue: mockEnvService,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    dataSource = module.get(getDataSourceToken());
    envService = module.get(EnvService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkHealth', () => {
    it('should return health status with correct format', () => {
      // Mock environment variables
      process.env.npm_package_version = '1.0.0';
      
      const result = service.checkHealth();

      expect(result).toEqual({
        status: 'ok',
        timestamp: expect.any(String),
        environment: mockEnvService.nodeEnv,
        version: '1.0.0',
      });
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    });

    it('should return default version when npm_package_version is not set', () => {
      delete process.env.npm_package_version;
      
      const result = service.checkHealth();

      expect(result).toEqual({
        status: 'ok',
        timestamp: expect.any(String),
        environment: mockEnvService.nodeEnv,
        version: '1.0.0',
      });
    });
  });

  describe('checkDatabaseHealth', () => {
    it('should return database connected status when query succeeds', async () => {
      dataSource.query.mockResolvedValue([{ result: 1 }]);

      const result = await service.checkDatabaseHealth();

      expect(dataSource.query).toHaveBeenCalledWith('SELECT 1');
      expect(result).toEqual({
        status: 'ok',
        database: {
          type: 'postgresql',
          connected: true,
        },
        timestamp: expect.any(String),
      });
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    });

    it('should return database error status when query fails with Error instance', async () => {
      const error = new Error('Connection timeout');
      dataSource.query.mockRejectedValue(error);

      const result = await service.checkDatabaseHealth();

      expect(dataSource.query).toHaveBeenCalledWith('SELECT 1');
      expect(result).toEqual({
        status: 'error',
        database: {
          type: 'postgresql',
          connected: false,
          error: 'Connection timeout',
        },
        timestamp: expect.any(String),
      });
    });

    it('should return database error status with unknown error when error is not Error instance', async () => {
      dataSource.query.mockRejectedValue('string error');

      const result = await service.checkDatabaseHealth();

      expect(dataSource.query).toHaveBeenCalledWith('SELECT 1');
      expect(result).toEqual({
        status: 'error',
        database: {
          type: 'postgresql',
          connected: false,
          error: 'Unknown error',
        },
        timestamp: expect.any(String),
      });
    });
  });
});