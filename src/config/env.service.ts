import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) {}

  // Database Configuration
  get postgresHost(): string {
    return this.configService.get<string>('POSTGRES_HOST') || 'localhost';
  }

  get postgresPort(): number {
    return this.configService.get<number>('POSTGRES_PORT') || 5432;
  }

  get postgresUser(): string {
    return this.configService.get<string>('POSTGRES_USER') || 'postgres';
  }

  get postgresPassword(): string {
    return this.configService.get<string>('POSTGRES_PASSWORD') || 'postgres';
  }

  get postgresDatabase(): string {
    return (
      this.configService.get<string>('POSTGRES_DB') || 'interview_appointment'
    );
  }

  // Application Configuration
  get appPort(): number {
    return this.configService.get<number>('APP_PORT') || 3000;
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }

  // JWT Configuration
  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || 'default-secret';
  }

  get jwtExpiration(): string {
    return this.configService.get<string>('JWT_EXPIRATION') || '1d';
  }

  // Helper methods
  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  // Database URL for TypeORM
  get databaseUrl(): string {
    return `postgresql://${this.postgresUser}:${this.postgresPassword}@${this.postgresHost}:${this.postgresPort}/${this.postgresDatabase}`;
  }
}
