import { Controller, Get } from '@nestjs/common';
import { HealthService } from 'src/health/health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth() {
    return this.healthService.checkHealth();
  }

  @Get('db')
  async getDatabaseHealth() {
    return this.healthService.checkDatabaseHealth();
  }
}
