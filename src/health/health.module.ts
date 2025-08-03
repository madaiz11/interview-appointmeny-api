import { Module } from '@nestjs/common';
import { EnvService } from '../config/env.service';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService, EnvService],
})
export class HealthModule {}
