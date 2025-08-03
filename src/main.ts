import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './config/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);
  const port = envService.appPort;

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `🗄️  Database: ${envService.postgresHost}:${envService.postgresPort}/${envService.postgresDatabase}`,
  );
  console.log(`🌍 Environment: ${envService.nodeEnv}`);
}
bootstrap();
