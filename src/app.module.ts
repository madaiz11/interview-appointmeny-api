import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewModule } from 'src/interview/interview.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from './auth/auth.module';
import { createDatabaseConfig } from './config/database.config';
import { EnvService } from './config/env.service';
import { SeederModule } from './database/seeders/seeder.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        createDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    HealthModule,
    SeederModule,
    AuthModule,
    UserModule,
    InterviewModule,
  ],
  providers: [EnvService],
})
export class AppModule {}
