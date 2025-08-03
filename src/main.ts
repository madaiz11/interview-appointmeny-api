import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvService } from './config/env.service';
import {
  createSwaggerConfig,
  swaggerCustomOptions,
} from './config/swagger.config';

function setupSwagger(app: any, envService: EnvService) {
  if (!envService.isDevelopment) {
    console.log('📚 Swagger documentation disabled in production mode');
    return;
  }

  const config = createSwaggerConfig(envService);
  if (!config) {
    return;
  }

  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger with custom options
  SwaggerModule.setup('api/docs', app, document, {
    ...swaggerCustomOptions,
    swaggerUiEnabled: envService.isDevelopment,
  });

  console.log(
    `📚 Swagger documentation available at: http://localhost:${envService.appPort}/api/docs`,
  );
  console.log(
    `🔐 Swagger UI is protected and only available in development mode`,
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);

  // Enable CORS for development
  if (envService.isDevelopment) {
    app.enableCors({
      origin: true,
      credentials: true,
    });
  }

  // Setup Swagger documentation
  setupSwagger(app, envService);

  const port = envService.appPort;

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `🗄️  Database: ${envService.postgresHost}:${envService.postgresPort}/${envService.postgresDatabase}`,
  );
  console.log(`🌍 Environment: ${envService.nodeEnv}`);

  if (envService.isDevelopment) {
    console.log(`📖 Health Check: http://localhost:${port}/health`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  }
}
bootstrap();
