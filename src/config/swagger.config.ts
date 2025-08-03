import { DocumentBuilder } from '@nestjs/swagger';
import { EnvService } from './env.service';

export function createSwaggerConfig(envService: EnvService) {
  if (!envService.isDevelopment) {
    return null;
  }

  return new DocumentBuilder()
    .setTitle('Interview Appointment API')
    .setDescription(
      'A comprehensive REST API for managing interview appointments, users, and scheduling. ' +
        'This API provides role-based access control with support for admins, HR personnel, interviewers, and candidates.\n\n' +
        '## Features\n' +
        '- 🔐 JWT-based authentication\n' +
        '- 👥 Role-based access control (Admin, HR, Interviewer, Candidate)\n' +
        '- 📅 Interview appointment management\n' +
        '- 👤 User profile management\n' +
        '- 🏥 Health monitoring endpoints\n' +
        '- 🗄️ PostgreSQL database with TypeORM\n\n' +
        '## Getting Started\n' +
        '1. Authenticate using the `/auth/login` endpoint\n' +
        '2. Use the returned JWT token in the Authorization header\n' +
        '3. Access endpoints based on your role permissions\n\n' +
        '## Environment\n' +
        `Current environment: **${envService.nodeEnv}**\n` +
        `Database: ${envService.postgresHost}:${envService.postgresPort}/${envService.postgresDatabase}`,
    )
    .setVersion('1.0.0')
    .setContact(
      'API Support',
      'https://github.com/your-org/interview-appointment-api',
      'support@yourcompany.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer(`http://localhost:${envService.appPort}`, 'Development Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token obtained from /auth/login',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
}

export const swaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true,
    tryItOutEnabled: true,
    requestInterceptor: (req: any) => {
      // Add custom headers or modify requests if needed
      return req;
    },
  },
  customSiteTitle: 'Interview Appointment API - Documentation',
  customfavIcon: '/favicon.ico',
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #3b82f6; font-size: 36px; }
    .swagger-ui .info .description { margin: 20px 0; }
    .swagger-ui .info .description h2 { color: #1f2937; margin-top: 20px; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .swagger-ui .auth-container { margin: 20px 0; }
    .swagger-ui .btn.authorize { background-color: #10b981; border-color: #10b981; }
    .swagger-ui .btn.authorize:hover { background-color: #059669; border-color: #059669; }
  `,
  explorer: true,
  swaggerUiEnabled: true,
};
