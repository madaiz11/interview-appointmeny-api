import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EnvService } from '../config/env.service';

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private envService: EnvService,
  ) {}

  async checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: this.envService.nodeEnv,
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  async checkDatabaseHealth() {
    try {
      await this.dataSource.query('SELECT 1');

      return {
        status: 'ok',
        database: {
          type: 'postgresql',
          connected: true,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: {
          type: 'postgresql',
          connected: false,
          error: error.message,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }
}
