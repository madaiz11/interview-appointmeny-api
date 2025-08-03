import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const createDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST') || 'localhost',
  port: configService.get<number>('POSTGRES_PORT') || 5433,
  username: configService.get<string>('POSTGRES_USER') || 'postgres',
  password: configService.get<string>('POSTGRES_PASSWORD') || 'postgres',
  database: configService.get<string>('POSTGRES_DB') || 'interview_appointment',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/../**/*.subscriber{.ts,.js}'],
  synchronize: false, // Disabled - using migrations instead
  migrationsRun: false, // Set to true in production to auto-run migrations
  logging:
    (configService.get<string>('NODE_ENV') || 'development') === 'development',
  ssl:
    (configService.get<string>('NODE_ENV') || 'development') === 'production'
      ? { rejectUnauthorized: false }
      : false,
  retryAttempts: 3,
  retryDelay: 3000,
  autoLoadEntities: true,
});
