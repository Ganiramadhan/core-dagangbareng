import { NestFactory } from '@nestjs/core';
import { AuthApiModule } from './auth-api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthApiModule);
  const logger = new Logger('Bootstrap');

  // ✅ Load environment variables from ConfigService
  const configService = app.get(ConfigService);
  const port: number = parseInt(configService.get('PORT') || '3001', 10);
  const nodeEnv: string =
    configService.get<string>('NODE_ENV') || 'development';

  // ✅ Enable CORS for frontend access
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // ✅ Apply global validation pipe for incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Setup Swagger documentation (only available in development)
  if (nodeEnv === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Auth API')
      .setDescription('API for user authentication')
      .setVersion('1.0')
      .addTag('Auth')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);
  }

  // ✅ Start the application
  await app.listen(port);
  logger.log(`🚀 Auth API is running at: http://localhost:${port}`);

  if (nodeEnv === 'development') {
    logger.log(
      `📚 Swagger docs available at: http://localhost:${port}/api-docs`,
    );
  }
}

void bootstrap();
