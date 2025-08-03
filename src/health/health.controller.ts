import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Get application health status',
    description:
      'Returns the current health status of the application including uptime, environment, and version information.',
  })
  @ApiOkResponse({
    description: 'Application is healthy and running normally',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
          description: 'Health status indicator',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-08-03T02:33:19.704Z',
          description: 'Current timestamp',
        },
        environment: {
          type: 'string',
          example: 'development',
          description: 'Current environment mode',
        },
        version: {
          type: 'string',
          example: '1.0.0',
          description: 'Application version',
        },
      },
    },
  })
  @ApiServiceUnavailableResponse({
    description: 'Application is unhealthy or experiencing issues',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
        },
        error: {
          type: 'string',
          description: 'Error message describing the issue',
        },
      },
    },
  })
  async getHealth() {
    return this.healthService.checkHealth();
  }

  @Get('db')
  @ApiOperation({
    summary: 'Get database health status',
    description:
      'Checks the database connectivity and returns detailed connection information including host, port, database name, and connection status.',
  })
  @ApiOkResponse({
    description: 'Database is connected and healthy',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
          description: 'Database health status',
        },
        database: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              example: 'postgresql',
              description: 'Database type',
            },
            host: {
              type: 'string',
              example: 'localhost',
              description: 'Database host',
            },
            port: {
              type: 'string',
              example: '5433',
              description: 'Database port',
            },
            database: {
              type: 'string',
              example: 'interview_appointment',
              description: 'Database name',
            },
            connected: {
              type: 'boolean',
              example: true,
              description: 'Connection status',
            },
          },
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-08-03T02:33:19.704Z',
        },
      },
    },
  })
  @ApiServiceUnavailableResponse({
    description: 'Database connection failed or is unhealthy',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        database: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'postgresql' },
            host: { type: 'string', example: 'localhost' },
            port: { type: 'string', example: '5433' },
            database: { type: 'string', example: 'interview_appointment' },
            connected: { type: 'boolean', example: false },
            error: {
              type: 'string',
              example: 'Connection timeout',
              description: 'Specific database error message',
            },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  async getDatabaseHealth() {
    return this.healthService.checkDatabaseHealth();
  }
}
